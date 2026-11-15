package com.bodegacore.service;

import com.bodegacore.dto.AssetCreateDTO;
import com.bodegacore.dto.AssetDTO;
import com.bodegacore.dto.AssignAssetRequest;
import com.bodegacore.dto.MaintenanceRecommendationDTO;
import com.bodegacore.dto.MaintenanceRequest;
import com.bodegacore.dto.ReleaseMaintenanceRequest;
import com.bodegacore.dto.ReturnAssetRequest;
import com.bodegacore.exception.DuplicateAssetTagException;
import com.bodegacore.exception.InvalidStateTransitionException;
import com.bodegacore.exception.ResourceNotFoundException;
import com.bodegacore.model.Asset;
import com.bodegacore.model.AssetCategory;
import com.bodegacore.model.AssetStatus;
import com.bodegacore.model.Custodian;
import com.bodegacore.repository.AssetRepository;
import com.bodegacore.repository.CustodianRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service managing warehouse asset lifecycles, business rules, state transitions,
 * and maintenance recommendations.
 */
@Service
@Transactional
public class AssetService {

    private static final Logger log = LoggerFactory.getLogger(AssetService.class);

    private final AssetRepository assetRepository;
    private final CustodianRepository custodianRepository;

    public AssetService(AssetRepository assetRepository, CustodianRepository custodianRepository) {
        this.assetRepository = assetRepository;
        this.custodianRepository = custodianRepository;
    }

    /**
     * Retrieves assets based on optional filter parameters.
     */
    @Transactional(readOnly = true)
    public List<AssetDTO> getAssets(AssetCategory category, AssetStatus status,
                                    Boolean critical, Boolean olderThan90Days, String search) {
        boolean onlyMaintenance = Boolean.TRUE.equals(critical);
        boolean onlyOlder = Boolean.TRUE.equals(olderThan90Days);
        LocalDate cutoffDate = LocalDate.now().minusDays(90);

        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        List<Asset> results = assetRepository.searchAssets(
            category,
            status,
            onlyMaintenance,
            onlyOlder,
            cutoffDate,
            cleanSearch
        );

        return results.stream().map(AssetDTO::fromEntity).collect(Collectors.toList());
    }

    /**
     * Retrieves an asset by its primary key id.
     */
    @Transactional(readOnly = true)
    public AssetDTO getAssetById(Long id) {
        Asset asset = assetRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));
        return AssetDTO.fromEntity(asset);
    }

    /**
     * Registers a new asset in warehouse inventory.
     */
    public AssetDTO createAsset(AssetCreateDTO dto) {
        if (assetRepository.existsByAssetTag(dto.getAssetTag())) {
            throw new DuplicateAssetTagException("Asset tag already exists: " + dto.getAssetTag());
        }

        if (dto.getAcquisitionCost() == null || dto.getAcquisitionCost().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Acquisition cost must be strictly greater than 0");
        }

        LocalDate inspectionDate = dto.getLastInspectionDate() != null
            ? dto.getLastInspectionDate()
            : dto.getPurchaseDate();

        Asset asset = new Asset(
            dto.getAssetTag().trim(),
            dto.getName().trim(),
            dto.getCategory(),
            dto.getBrand().trim(),
            dto.getModel().trim(),
            dto.getSerialNumber().trim(),
            dto.getWarehouseLocation().trim(),
            dto.getAcquisitionCost(),
            dto.getPurchaseDate(),
            inspectionDate,
            AssetStatus.DISPONIBLE
        );

        Asset saved = assetRepository.save(asset);
        log.info("[AUDIT_ASSET_CREATED] tag={}, name={}, cost={}", saved.getAssetTag(), saved.getName(), saved.getAcquisitionCost());
        return AssetDTO.fromEntity(saved);
    }

    /**
     * Assigns an available asset to a designated custodian.
     */
    public AssetDTO assignAsset(Long id, AssignAssetRequest request) {
        Asset asset = assetRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));

        if (asset.getStatus() == AssetStatus.EN_MANTENIMIENTO) {
            throw new InvalidStateTransitionException("Cannot assign an asset currently in maintenance (EN_MANTENIMIENTO)");
        }
        if (asset.getStatus() == AssetStatus.DE_BAJA) {
            throw new InvalidStateTransitionException("Cannot assign a retired asset (DE_BAJA)");
        }
        if (asset.getStatus() != AssetStatus.DISPONIBLE) {
            throw new InvalidStateTransitionException("Only DISPONIBLE assets can be assigned. Current status: " + asset.getStatus());
        }

        Custodian custodian = custodianRepository.findById(request.getCustodianId())
            .orElseThrow(() -> new ResourceNotFoundException("Custodian not found with id: " + request.getCustodianId()));

        asset.setCustodian(custodian);
        asset.setStatus(AssetStatus.ASIGNADO);

        Asset updated = assetRepository.save(asset);
        log.info("[AUDIT_ASSET_ASSIGNED] tag={}, custodian={}", updated.getAssetTag(), custodian.getFullName());
        return AssetDTO.fromEntity(updated);
    }

    /**
     * Returns an assigned asset back into warehouse custody.
     */
    public AssetDTO returnAsset(Long id, ReturnAssetRequest request) {
        Asset asset = assetRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));

        if (asset.getStatus() != AssetStatus.ASIGNADO) {
            throw new InvalidStateTransitionException("Only ASIGNADO assets can be returned. Current status: " + asset.getStatus());
        }

        asset.setCustodian(null);
        asset.setStatus(AssetStatus.DISPONIBLE);
        if (request.getWarehouseLocation() != null && !request.getWarehouseLocation().trim().isEmpty()) {
            asset.setWarehouseLocation(request.getWarehouseLocation().trim());
        }

        Asset updated = assetRepository.save(asset);
        log.info("[AUDIT_ASSET_RETURNED] tag={}, location={}", updated.getAssetTag(), updated.getWarehouseLocation());
        return AssetDTO.fromEntity(updated);
    }

    /**
     * Dispatches an asset to technical service or maintenance workshop.
     */
    public AssetDTO sendToMaintenance(Long id, MaintenanceRequest request) {
        Asset asset = assetRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));

        if (asset.getStatus() == AssetStatus.DE_BAJA) {
            throw new InvalidStateTransitionException("Cannot send a retired asset (DE_BAJA) to maintenance");
        }

        asset.setCustodian(null); // Release custodian custody when sent to workshop
        asset.setStatus(AssetStatus.EN_MANTENIMIENTO);
        asset.setServiceProvider(request.getServiceProvider().trim());
        asset.setMaintenanceReason(request.getReason().trim());

        Asset updated = assetRepository.save(asset);
        log.info("[AUDIT_MAINTENANCE_DISPATCH] tag={}, provider={}, reason={}",
                 updated.getAssetTag(), updated.getServiceProvider(), updated.getMaintenanceReason());
        return AssetDTO.fromEntity(updated);
    }

    /**
     * Releases an asset from maintenance back into available warehouse stock, renewing inspection date.
     */
    public AssetDTO releaseMaintenance(Long id, ReleaseMaintenanceRequest request) {
        Asset asset = assetRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));

        if (asset.getStatus() != AssetStatus.EN_MANTENIMIENTO) {
            throw new InvalidStateTransitionException("Only assets EN_MANTENIMIENTO can be released. Current status: " + asset.getStatus());
        }

        asset.setStatus(AssetStatus.DISPONIBLE);
        asset.setLastInspectionDate(LocalDate.now());
        asset.setServiceProvider(null);
        asset.setMaintenanceReason(null);
        if (request.getWarehouseLocation() != null && !request.getWarehouseLocation().trim().isEmpty()) {
            asset.setWarehouseLocation(request.getWarehouseLocation().trim());
        }

        Asset updated = assetRepository.save(asset);
        log.info("[AUDIT_MAINTENANCE_RELEASE] tag={}, newInspectionDate={}", updated.getAssetTag(), updated.getLastInspectionDate());
        return AssetDTO.fromEntity(updated);
    }

    /**
     * Evaluates business rules to produce preventive maintenance recommendations (P06).
     */
    @Transactional(readOnly = true)
    public List<MaintenanceRecommendationDTO> getMaintenanceRecommendations() {
        LocalDate cutoff = LocalDate.now().minusDays(90);
        List<Asset> candidates = assetRepository.findByLastInspectionDateBefore(cutoff);

        List<MaintenanceRecommendationDTO> recommendations = new ArrayList<>();
        for (Asset asset : candidates) {
            if (asset.getStatus() == AssetStatus.DE_BAJA) {
                continue;
            }
            long days = ChronoUnit.DAYS.between(asset.getLastInspectionDate(), LocalDate.now());
            String severity = (days > 180 || asset.getStatus() == AssetStatus.EN_MANTENIMIENTO) ? "CRITICAL" : "WARNING";
            String reason = "El activo registra " + days + " días sin inspección técnica reglamentaria (umbral: 90 días). Se sugiere revisión preventiva.";

            recommendations.add(new MaintenanceRecommendationDTO(
                asset.getId(),
                asset.getAssetTag(),
                asset.getName(),
                asset.getCategory(),
                asset.getLastInspectionDate(),
                days,
                reason,
                severity
            ));
        }

        return recommendations;
    }
}
