package com.bodegacore.dto;

/**
 * Data transfer object for Custodian details and assigned asset counts.
 */
public class CustodianDTO {

    private Long id;
    private String fullName;
    private String department;
    private String email;
    private int assignedAssetsCount;

    public CustodianDTO() {
    }

    public CustodianDTO(Long id, String fullName, String department, String email, int assignedAssetsCount) {
        this.id = id;
        this.fullName = fullName;
        this.department = department;
        this.email = email;
        this.assignedAssetsCount = assignedAssetsCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getAssignedAssetsCount() {
        return assignedAssetsCount;
    }

    public void setAssignedAssetsCount(int assignedAssetsCount) {
        this.assignedAssetsCount = assignedAssetsCount;
    }
}
