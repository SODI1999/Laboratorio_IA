package com.bodegacore.dto;

import com.bodegacore.model.AssetCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data payload for registering a new asset into warehouse inventory.
 */
public class AssetCreateDTO {

    @NotBlank(message = "Asset tag is required")
    private String assetTag;

    @NotBlank(message = "Asset name is required")
    private String name;

    @NotNull(message = "Category is required")
    private AssetCategory category;

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Model is required")
    private String model;

    @NotBlank(message = "Serial number is required")
    private String serialNumber;

    @NotBlank(message = "Warehouse location is required")
    private String warehouseLocation;

    @NotNull(message = "Acquisition cost is required")
    @DecimalMin(value = "0.01", message = "Acquisition cost must be strictly greater than 0")
    private BigDecimal acquisitionCost;

    @NotNull(message = "Purchase date is required")
    private LocalDate purchaseDate;

    private LocalDate lastInspectionDate;

    public AssetCreateDTO() {
    }

    public AssetCreateDTO(String assetTag, String name, AssetCategory category, String brand,
                          String model, String serialNumber, String warehouseLocation,
                          BigDecimal acquisitionCost, LocalDate purchaseDate, LocalDate lastInspectionDate) {
        this.assetTag = assetTag;
        this.name = name;
        this.category = category;
        this.brand = brand;
        this.model = model;
        this.serialNumber = serialNumber;
        this.warehouseLocation = warehouseLocation;
        this.acquisitionCost = acquisitionCost;
        this.purchaseDate = purchaseDate;
        this.lastInspectionDate = lastInspectionDate;
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
}
