package com.bodegacore.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Payload for releasing an asset from maintenance back into warehouse stock,
 * renewing its inspection date.
 */
public class ReleaseMaintenanceRequest {

    @NotBlank(message = "Warehouse location is required")
    private String warehouseLocation;

    private String notes;

    public ReleaseMaintenanceRequest() {
    }

    public ReleaseMaintenanceRequest(String warehouseLocation, String notes) {
        this.warehouseLocation = warehouseLocation;
        this.notes = notes;
    }

    public String getWarehouseLocation() {
        return warehouseLocation;
    }

    public void setWarehouseLocation(String warehouseLocation) {
        this.warehouseLocation = warehouseLocation;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
