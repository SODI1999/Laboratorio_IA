package com.bodegacore.dto;

import jakarta.validation.constraints.NotNull;

/**
 * Payload for assigning an available asset to a custodian.
 */
public class AssignAssetRequest {

    @NotNull(message = "Custodian ID is required")
    private Long custodianId;

    private String notes;

    public AssignAssetRequest() {
    }

    public AssignAssetRequest(Long custodianId, String notes) {
        this.custodianId = custodianId;
        this.notes = notes;
    }

    public Long getCustodianId() {
        return custodianId;
    }

    public void setCustodianId(Long custodianId) {
        this.custodianId = custodianId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
