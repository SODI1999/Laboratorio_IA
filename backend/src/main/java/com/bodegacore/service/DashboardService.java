package com.bodegacore.service;

import com.bodegacore.dto.DashboardDTO;
import com.bodegacore.dto.MaintenanceRecommendationDTO;
import com.bodegacore.model.Asset;
import com.bodegacore.model.AssetCategory;
import com.bodegacore.model.AssetStatus;
import com.bodegacore.repository.AssetRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service calculating high-level business metrics, portfolio valuation,
 * and status distribution for executive dashboard monitoring.
 */
@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final AssetRepository assetRepository;
    private final AssetService assetService;

    public DashboardService(AssetRepository assetRepository, AssetService assetService) {
        this.assetRepository = assetRepository;
        this.assetService = assetService;
    }

    /**
     * Aggregates key performance indicators across the entire physical asset inventory.
     */
    public DashboardDTO getDashboardMetrics() {
        DashboardDTO dto = new DashboardDTO();

        long totalAssets = assetRepository.count();
        dto.setTotalAssets(totalAssets);

        BigDecimal valuation = assetRepository.calculateTotalValuation();
        dto.setTotalValuation(valuation != null ? valuation : BigDecimal.ZERO);

        Map<AssetStatus, Long> statusMap = new EnumMap<>(AssetStatus.class);
        for (AssetStatus status : AssetStatus.values()) {
            statusMap.put(status, assetRepository.countByStatus(status));
        }
        dto.setStatusDistribution(statusMap);

        Map<AssetCategory, Long> categoryMap = new EnumMap<>(AssetCategory.class);
        for (AssetCategory cat : AssetCategory.values()) {
            categoryMap.put(cat, assetRepository.countByCategory(cat));
        }
        dto.setCategoryDistribution(categoryMap);

        long availableCount = statusMap.getOrDefault(AssetStatus.DISPONIBLE, 0L);
        double rate = totalAssets > 0
            ? BigDecimal.valueOf((double) availableCount / totalAssets * 100.0)
                .setScale(1, RoundingMode.HALF_UP)
                .doubleValue()
            : 0.0;
        dto.setAvailabilityRate(rate);

        LocalDate cutoff = LocalDate.now().minusDays(90);
        List<Asset> olderAssets = assetRepository.findByLastInspectionDateBefore(cutoff);
        dto.setOlderThan90DaysCount(olderAssets.size());

        List<Asset> criticalAssets = assetRepository.findCriticalAssets(AssetStatus.EN_MANTENIMIENTO, cutoff);
        dto.setCriticalAssetsCount(criticalAssets.size());

        List<MaintenanceRecommendationDTO> recommendations = assetService.getMaintenanceRecommendations();
        dto.setRecommendations(recommendations);

        return dto;
    }
}
