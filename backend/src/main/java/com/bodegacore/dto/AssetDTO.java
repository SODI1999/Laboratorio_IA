package com.bodegacore.dto;

import com.bodegacore.model.Asset;
import com.bodegacore.model.AssetCategory;
import com.bodegacore.model.AssetStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * Data transfer object representing an asset with calculated fields for UI and compliance.
 */
public class AssetDTO {

    private Long id;
    private String assetTag;
    private String name;
    private AssetCategory category;
    private String brand;
    private String model;
    private String serialNumber;
    private String warehouseLocation;
    private BigDecimal acquisitionCost;
    private LocalDate purchaseDate;
    private LocalDate lastInspectionDate;
    private AssetStatus status;
    private CustodianDTO custodian;
    private String serviceProvider;
    private String maintenanceReason;
    private boolean isOlderThan90Days;
    private boolean recommendedMaintenance;
    private long daysSinceInspection;

    public AssetDTO() {
    }

    public static AssetDTO fromEntity(Asset asset) {
        AssetDTO dto = new AssetDTO();
        dto.setId(asset.getId());
        dto.setAssetTag(asset.getAssetTag());
        dto.setName(asset.getName());
        dto.setCategory(asset.getCategory());
        dto.setBrand(asset.getBrand());
        dto.setModel(asset.getModel());
        dto.setSerialNumber(asset.getSerialNumber());
        dto.setWarehouseLocation(asset.getWarehouseLocation());
        dto.setAcquisitionCost(asset.getAcquisitionCost());
        dto.setPurchaseDate(asset.getPurchaseDate());
        dto.setLastInspectionDate(asset.getLastInspectionDate());
        dto.setStatus(asset.getStatus());
        dto.setServiceProvider(asset.getServiceProvider());
        dto.setMaintenanceReason(asset.getMaintenanceReason());

        if (asset.getCustodian() != null) {
            dto.setCustodian(new CustodianDTO(
                asset.getCustodian().getId(),
                asset.getCustodian().getFullName(),
                asset.getCustodian().getDepartment(),
                asset.getCustodian().getEmail(),
                asset.getCustodian().getAssignedAssets() != null ? asset.getCustodian().getAssignedAssets().size() : 0
            ));
        }

        if (asset.getLastInspectionDate() != null) {
            long days = ChronoUnit.DAYS.between(asset.getLastInspectionDate(), LocalDate.now());
            dto.setDaysSinceInspection(days);
            dto.setOlderThan90Days(days > 90);
            // Preventive maintenance is recommended if > 90 days without inspection and not retired
            dto.setRecommendedMaintenance(days > 90 && asset.getStatus() != AssetStatus.DE_BAJA);
        }

        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getWarehouseLocation() {
        return warehouseLocation;
    }

    public void setWarehouseLocation(String warehouseLocation) {
        this.warehouseLocation = warehouseLocation;
    }

    public BigDecimal getAcquisitionCost() {
        return acquisitionCost;
    }

    public void setAcquisitionCost(BigDecimal acquisitionCost) {
        this.acquisitionCost = acquisitionCost;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public LocalDate getLastInspectionDate() {
        return lastInspectionDate;
    }

    public void setLastInspectionDate(LocalDate lastInspectionDate) {
        this.lastInspectionDate = lastInspectionDate;
    }

    public AssetStatus getStatus() {
        return status;
    }

    public void setStatus(AssetStatus status) {
        this.status = status;
    }

    public CustodianDTO getCustodian() {
        return custodian;
    }

    public void setCustodian(CustodianDTO custodian) {
        this.custodian = custodian;
    }

    public String getServiceProvider() {
        return serviceProvider;
    }

    public void setServiceProvider(String serviceProvider) {
        this.serviceProvider = serviceProvider;
    }

    public String getMaintenanceReason() {
        return maintenanceReason;
    }

    public void setMaintenanceReason(String maintenanceReason) {
        this.maintenanceReason = maintenanceReason;
    }

    public boolean isOlderThan90Days() {
        return isOlderThan90Days;
    }

    public void setOlderThan90Days(boolean olderThan90Days) {
        isOlderThan90Days = olderThan90Days;
    }

    public boolean isRecommendedMaintenance() {
        return recommendedMaintenance;
    }

    public void setRecommendedMaintenance(boolean recommendedMaintenance) {
        this.recommendedMaintenance = recommendedMaintenance;
    }

    public long getDaysSinceInspection() {
        return daysSinceInspection;
    }

    public void setDaysSinceInspection(long daysSinceInspection) {
        this.daysSinceInspection = daysSinceInspection;
    }
}
