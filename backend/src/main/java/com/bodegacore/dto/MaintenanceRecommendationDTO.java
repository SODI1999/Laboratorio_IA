package com.bodegacore.dto;

import com.bodegacore.model.AssetCategory;
import java.time.LocalDate;

/**
 * Data transfer object representing an automated preventive maintenance recommendation.
 */
public class MaintenanceRecommendationDTO {

    private Long assetId;
    private String assetTag;
    private String name;
    private AssetCategory category;
    private LocalDate lastInspectionDate;
    private long daysSinceInspection;
    private String reason;
    private String severity; // WARNING, CRITICAL

    public MaintenanceRecommendationDTO() {
    }

    public MaintenanceRecommendationDTO(Long assetId, String assetTag, String name,
                                       AssetCategory category, LocalDate lastInspectionDate,
                                       long daysSinceInspection, String reason, String severity) {
        this.assetId = assetId;
        this.assetTag = assetTag;
        this.name = name;
        this.category = category;
        this.lastInspectionDate = lastInspectionDate;
        this.daysSinceInspection = daysSinceInspection;
        this.reason = reason;
        this.severity = severity;
    }

    public Long getAssetId() {
        return assetId;
    }

    public void setAssetId(Long assetId) {
        this.assetId = assetId;
    }

    public String getAssetTag() {
        return assetTag;
    }

    public void setAssetTag(String assetTag) {
        this.assetTag = assetTag;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public AssetCategory getCategory() {
        return category;
    }

    public void setCategory(AssetCategory category) {
        this.category = category;
    }

    public LocalDate getLastInspectionDate() {
        return lastInspectionDate;
    }

    public void setLastInspectionDate(LocalDate lastInspectionDate) {
        this.lastInspectionDate = lastInspectionDate;
    }

    public long getDaysSinceInspection() {
        return daysSinceInspection;
    }

    public void setDaysSinceInspection(long daysSinceInspection) {
        this.daysSinceInspection = daysSinceInspection;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }
}
