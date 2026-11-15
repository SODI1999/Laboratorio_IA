package com.bodegacore.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.bodegacore.dto.AssignAssetRequest;
import com.bodegacore.dto.MaintenanceRecommendationDTO;
import com.bodegacore.dto.AssetDTO;
import com.bodegacore.exception.InvalidStateTransitionException;
import com.bodegacore.model.Asset;
import com.bodegacore.model.AssetCategory;
import com.bodegacore.model.AssetStatus;
import com.bodegacore.model.Custodian;
import com.bodegacore.repository.AssetRepository;
import com.bodegacore.repository.CustodianRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration and business rule tests for AssetService against H2 in-memory database.
 */
@SpringBootTest
@Transactional
class AssetServiceTest {

    @Autowired
    private AssetService assetService;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private CustodianRepository custodianRepository;

    private Custodian savedCustodian;

    @BeforeEach
    void setUp() {
        savedCustodian = custodianRepository.save(
            new Custodian("Ing. Carlos Mendoza", "Operaciones TI", "carlos.mendoza@empresa.com")
        );
    }

    @Test
    @DisplayName("AC-04: Cannot assign an asset in EN_MANTENIMIENTO or DE_BAJA")
    void testCannotAssignAssetInMaintenanceOrDeBaja() {
        Asset maintenanceAsset = assetRepository.save(new Asset(
            "ACT-SRV-001",
            "Generador Eléctrico Honda",
            AssetCategory.MAQUINARIA_LIVIANA,
            "Honda",
            "EU2200i",
            "SN-HON-01",
            "Taller Mecánico Central",
            new BigDecimal("4800000.00"),
            LocalDate.now().minusMonths(5),
            LocalDate.now().minusDays(15),
            AssetStatus.EN_MANTENIMIENTO
        ));

        Asset retiredAsset = assetRepository.save(new Asset(
            "ACT-RET-001",
            "Servidor HP ProLiant G7",
            AssetCategory.REDES_TI,
            "HP",
            "DL380 G7",
            "SN-HP-01",
            "Bodega de Bajas",
            new BigDecimal("8200000.00"),
            LocalDate.now().minusYears(6),
            LocalDate.now().minusYears(2),
            AssetStatus.DE_BAJA
        ));

        AssignAssetRequest request = new AssignAssetRequest(savedCustodian.getId(), "Entrega para turno");

        assertThatThrownBy(() -> assetService.assignAsset(maintenanceAsset.getId(), request))
            .isInstanceOf(InvalidStateTransitionException.class)
            .hasMessageContaining("EN_MANTENIMIENTO");

        assertThatThrownBy(() -> assetService.assignAsset(retiredAsset.getId(), request))
            .isInstanceOf(InvalidStateTransitionException.class)
            .hasMessageContaining("DE_BAJA");
    }

    @Test
    @DisplayName("AC-07: Assigning an available asset transitions state to ASIGNADO with custodian link")
    void testAssignAssetTransitionsToAsignado() {
        Asset availableAsset = assetRepository.save(new Asset(
            "ACT-AVAIL-001",
            "Multímetro Digital Fluke 87V",
            AssetCategory.HERRAMIENTAS,
            "Fluke",
            "87V Max",
            "SN-FLK-01",
            "Pasillo B - Estante 2",
            new BigDecimal("2100000.00"),
            LocalDate.now().minusMonths(4),
            LocalDate.now().minusDays(20),
            AssetStatus.DISPONIBLE
        ));

        AssignAssetRequest request = new AssignAssetRequest(savedCustodian.getId(), "Entrega para cuadrilla de campo");
        AssetDTO updated = assetService.assignAsset(availableAsset.getId(), request);

        assertThat(updated.getStatus()).isEqualTo(AssetStatus.ASIGNADO);
        assertThat(updated.getCustodian()).isNotNull();
        assertThat(updated.getCustodian().getId()).isEqualTo(savedCustodian.getId());
        assertThat(updated.getCustodian().getFullName()).isEqualTo("Ing. Carlos Mendoza");
    }

    @Test
    @DisplayName("P06: Preventive maintenance rule identifies assets older than 90 days without inspection")
    void testPreventiveMaintenanceRecommendationRule() {
        Asset uninspectedAsset = assetRepository.save(new Asset(
            "ACT-REC-RULE-01",
            "Medidor de Aislamiento Megger",
            AssetCategory.HERRAMIENTAS,
            "Megger",
            "MIT420",
            "SN-MEG-01",
            "Pasillo B - Estante 4",
            new BigDecimal("3500000.00"),
            LocalDate.now().minusMonths(8),
            LocalDate.now().minusDays(115), // > 90 days ago
            AssetStatus.DISPONIBLE
        ));

        List<MaintenanceRecommendationDTO> recommendations = assetService.getMaintenanceRecommendations();

        assertThat(recommendations).isNotEmpty();
        assertThat(recommendations)
            .extracting(MaintenanceRecommendationDTO::getAssetTag)
            .contains("ACT-REC-RULE-01");

        MaintenanceRecommendationDTO match = recommendations.stream()
            .filter(r -> "ACT-REC-RULE-01".equals(r.getAssetTag()))
            .findFirst()
            .orElseThrow();

        assertThat(match.getDaysSinceInspection()).isGreaterThanOrEqualTo(115);
        assertThat(match.getReason()).contains("reglamentaria");
    }
}
