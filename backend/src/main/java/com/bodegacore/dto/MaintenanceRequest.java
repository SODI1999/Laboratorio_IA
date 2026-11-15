package com.bodegacore.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Payload for dispatching an asset to technical maintenance or calibration.
 */
public class MaintenanceRequest {

    @NotBlank(message = "Service provider / workshop name is required")
    private String serviceProvider;

    @NotBlank(message = "Maintenance reason is required")
    private String reason;

    public MaintenanceRequest() {
    }

    public MaintenanceRequest(String serviceProvider, String reason) {
        this.serviceProvider = serviceProvider;
        this.reason = reason;
    }

    public String getServiceProvider() {
        return serviceProvider;
    }

    public void setServiceProvider(String serviceProvider) {
        this.serviceProvider = serviceProvider;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
