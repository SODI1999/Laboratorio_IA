package com.bodegacore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

/**
 * Custodian or employee responsible for assigned assets.
 */
@Entity
@Table(name = "custodians")
public class Custodian {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Custodian full name is required")
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @NotBlank(message = "Department is required")
    @Column(nullable = false)
    private String department;

    @Email(message = "Email must be valid")
    @NotBlank(message = "Email is required")
    @Column(nullable = false)
    private String email;

    @JsonIgnore
    @OneToMany(mappedBy = "custodian")
    private List<Asset> assignedAssets = new ArrayList<>();

    public Custodian() {
    }

    public Custodian(String fullName, String department, String email) {
        this.fullName = fullName;
        this.department = department;
        this.email = email;
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

    public List<Asset> getAssignedAssets() {
        return assignedAssets;
    }

    public void setAssignedAssets(List<Asset> assignedAssets) {
        this.assignedAssets = assignedAssets;
    }
}
