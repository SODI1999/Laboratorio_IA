package com.bodegacore.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Payload for returning an assigned asset back to warehouse stock.
 */
public class ReturnAssetRequest {

    @NotBlank(message = "Warehouse location is required")
    private String warehouseLocation;

    public ReturnAssetRequest() {
    }

    public ReturnAssetRequest(String warehouseLocation) {
        this.warehouseLocation = warehouseLocation;
    }

    public String getWarehouseLocation() {
        return warehouseLocation;
    }

    public void setWarehouseLocation(String warehouseLocation) {
        this.warehouseLocation = warehouseLocation;
    }
}
