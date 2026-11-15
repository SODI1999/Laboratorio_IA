package com.bodegacore.dto;

import com.bodegacore.model.AssetCategory;
import com.bodegacore.model.AssetStatus;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * Aggregated dashboard metrics for warehouse assets, financial valuation,
 * and preventive maintenance recommendations.
 */
public class DashboardDTO {

    private long totalAssets;
    private BigDecimal totalValuation;
    private double availabilityRate;
    private long criticalAssetsCount;
    private long olderThan90DaysCount;
    private Map<AssetStatus, Long> statusDistribution = new EnumMap<>(AssetStatus.class);
    private Map<AssetCategory, Long> categoryDistribution = new EnumMap<>(AssetCategory.class);
    private List<MaintenanceRecommendationDTO> recommendations = new ArrayList<>();

    public DashboardDTO() {
    }

    public long getTotalAssets() {
        return totalAssets;
    }

    public void setTotalAssets(long totalAssets) {
        this.totalAssets = totalAssets;
    }

    public BigDecimal getTotalValuation() {
        return totalValuation;
    }

    public void setTotalValuation(BigDecimal totalValuation) {
        this.totalValuation = totalValuation;
    }

    public double getAvailabilityRate() {
        return availabilityRate;
    }

    public void setAvailabilityRate(double availabilityRate) {
        this.availabilityRate = availabilityRate;
    }

    public long getCriticalAssetsCount() {
        return criticalAssetsCount;
    }

    public void setCriticalAssetsCount(long criticalAssetsCount) {
        this.criticalAssetsCount = criticalAssetsCount;
    }

    public long getOlderThan90DaysCount() {
        return olderThan90DaysCount;
    }

    public void setOlderThan90DaysCount(long olderThan90DaysCount) {
        this.olderThan90DaysCount = olderThan90DaysCount;
    }

    public Map<AssetStatus, Long> getStatusDistribution() {
        return statusDistribution;
    }

    public void setStatusDistribution(Map<AssetStatus, Long> statusDistribution) {
        this.statusDistribution = statusDistribution;
    }

    public Map<AssetCategory, Long> getCategoryDistribution() {
        return categoryDistribution;
    }

    public void setCategoryDistribution(Map<AssetCategory, Long> categoryDistribution) {
        this.categoryDistribution = categoryDistribution;
    }

    public List<MaintenanceRecommendationDTO> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<MaintenanceRecommendationDTO> recommendations) {
        this.recommendations = recommendations;
    }
}
