package com.bodegacore.controller;

import com.bodegacore.dto.AssetDTO;
import com.bodegacore.dto.CustodianDTO;
import com.bodegacore.exception.ResourceNotFoundException;
import com.bodegacore.model.Asset;
import com.bodegacore.model.Custodian;
import com.bodegacore.repository.AssetRepository;
import com.bodegacore.repository.CustodianRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for managing and querying custodians/employees and their assigned assets.
 */
@RestController
@RequestMapping("/api/custodians")
public class CustodianController {

    private final CustodianRepository custodianRepository;
    private final AssetRepository assetRepository;

    public CustodianController(CustodianRepository custodianRepository, AssetRepository assetRepository) {
        this.custodianRepository = custodianRepository;
        this.assetRepository = assetRepository;
    }

    /**
     * Lists all registered custodians along with their count of currently assigned assets.
     */
    @GetMapping
    public ResponseEntity<List<CustodianDTO>> getAllCustodians() {
        List<CustodianDTO> dtos = custodianRepository.findAll().stream().map(c -> {
            List<Asset> assigned = assetRepository.findByCustodianId(c.getId());
            return new CustodianDTO(c.getId(), c.getFullName(), c.getDepartment(), c.getEmail(), assigned.size());
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    /**
     * Retrieves all assets currently assigned to a specific custodian (P05).
     */
    @GetMapping("/{id}/assets")
    public ResponseEntity<List<AssetDTO>> getAssignedAssets(@PathVariable Long id) {
        if (!custodianRepository.existsById(id)) {
            throw new ResourceNotFoundException("Custodian not found with id: " + id);
        }
        List<Asset> assets = assetRepository.findByCustodianId(id);
        List<AssetDTO> dtos = assets.stream().map(AssetDTO::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
