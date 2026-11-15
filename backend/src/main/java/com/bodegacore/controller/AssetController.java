package com.bodegacore.controller;

import com.bodegacore.dto.AssetCreateDTO;
import com.bodegacore.dto.AssetDTO;
import com.bodegacore.dto.AssignAssetRequest;
import com.bodegacore.dto.MaintenanceRecommendationDTO;
import com.bodegacore.dto.MaintenanceRequest;
import com.bodegacore.dto.ReleaseMaintenanceRequest;
import com.bodegacore.dto.ReturnAssetRequest;
import com.bodegacore.model.AssetCategory;
import com.bodegacore.model.AssetStatus;
import com.bodegacore.service.AssetService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller exposing endpoints for warehouse asset management,
 * queries, assignments, and maintenance workflows.
 */
@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    /**
     * Lists assets with optional decoupled filters for category, status,
     * critical condition (P03), antiquity > 90 days (P04), and text search.
     */
    @GetMapping
    public ResponseEntity<List<AssetDTO>> getAssets(
            @RequestParam(required = false) AssetCategory category,
            @RequestParam(required = false) AssetStatus status,
            @RequestParam(required = false) Boolean critical,
            @RequestParam(required = false) Boolean olderThan90Days,
            @RequestParam(required = false) String search) {
        List<AssetDTO> assets = assetService.getAssets(category, status, critical, olderThan90Days, search);
        return ResponseEntity.ok(assets);
    }

    /**
     * Retrieves an individual asset's technical sheet.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AssetDTO> getAssetById(@PathVariable Long id) {
        return ResponseEntity.ok(assetService.getAssetById(id));
    }

    /**
     * Registers a new asset in warehouse inventory.
     */
    @PostMapping
    public ResponseEntity<AssetDTO> createAsset(@Valid @RequestBody AssetCreateDTO dto) {
        AssetDTO created = assetService.createAsset(dto);
        return ResponseEntity.created(URI.create("/api/assets/" + created.getId())).body(created);
    }

    /**
     * Assigns an available asset to a designated custodian.
     */
    @PutMapping("/{id}/assign")
    public ResponseEntity<AssetDTO> assignAsset(
            @PathVariable Long id,
            @Valid @RequestBody AssignAssetRequest request) {
        return ResponseEntity.ok(assetService.assignAsset(id, request));
    }

    /**
     * Returns an assigned asset back to warehouse stock.
     */
    @PutMapping("/{id}/return")
    public ResponseEntity<AssetDTO> returnAsset(
            @PathVariable Long id,
            @Valid @RequestBody ReturnAssetRequest request) {
        return ResponseEntity.ok(assetService.returnAsset(id, request));
    }

    /**
     * Dispatches an asset to technical maintenance or repair workshop.
     */
    @PutMapping("/{id}/maintenance")
    public ResponseEntity<AssetDTO> sendToMaintenance(
            @PathVariable Long id,
            @Valid @RequestBody MaintenanceRequest request) {
        return ResponseEntity.ok(assetService.sendToMaintenance(id, request));
    }

    /**
     * Releases an asset from maintenance back into available warehouse inventory.
     */
    @PutMapping("/{id}/release-maintenance")
    public ResponseEntity<AssetDTO> releaseMaintenance(
            @PathVariable Long id,
            @Valid @RequestBody ReleaseMaintenanceRequest request) {
        return ResponseEntity.ok(assetService.releaseMaintenance(id, request));
    }

    /**
     * Returns active automated preventive maintenance recommendations (P06).
     */
    @GetMapping("/recommendations")
    public ResponseEntity<List<MaintenanceRecommendationDTO>> getRecommendations() {
        return ResponseEntity.ok(assetService.getMaintenanceRecommendations());
    }
}
