package com.bodegacore.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.bodegacore.model.Asset;
import com.bodegacore.model.AssetCategory;
import com.bodegacore.model.AssetStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.dao.DataIntegrityViolationException;

/**
 * Integration test for AssetRepository verifying persistence constraints and JPA queries.
 */
@DataJpaTest
class AssetRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private AssetRepository assetRepository;

    @Test
    @DisplayName("AC-01: Saving two assets with identical assetTag throws DataIntegrityViolationException")
    void testUniqueAssetTagConstraint() {
        Asset asset1 = new Asset(
            "ACT-TEST-001",
            "Laptop Dell Precision",
            AssetCategory.COMPUTO,
            "Dell",
            "Precision 5570",
            "SN-1001",
            "Pasillo A - Estante 1",
            new BigDecimal("6500000.00"),
            LocalDate.now().minusMonths(6),
            LocalDate.now().minusDays(30),
            AssetStatus.DISPONIBLE
        );
        entityManager.persistAndFlush(asset1);

        Asset asset2 = new Asset(
            "ACT-TEST-001", // Duplicate tag
            "Laptop ThinkPad T14",
            AssetCategory.COMPUTO,
            "Lenovo",
            "T14 Gen 3",
            "SN-1002",
            "Pasillo A - Estante 2",
            new BigDecimal("5200000.00"),
            LocalDate.now().minusMonths(3),
            LocalDate.now().minusDays(10),
            AssetStatus.DISPONIBLE
        );

        assertThatThrownBy(() -> assetRepository.saveAndFlush(asset2))
            .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    @DisplayName("AC-06: Querying assets by antiquity finds records older than 90 days")
    void testFindCriticalAssetsOlderThan90Days() {
        LocalDate cutoff = LocalDate.now().minusDays(90);

        Asset oldAsset = new Asset(
            "ACT-OLD-001",
            "Osciloscopio Digital Tektronix",
            AssetCategory.HERRAMIENTAS,
            "Tektronix",
            "TBS1102B",
            "SN-OSC-01",
            "Pasillo B - Estante 3",
            new BigDecimal("3800000.00"),
            LocalDate.now().minusMonths(12),
            LocalDate.now().minusDays(120), // >90 days ago
            AssetStatus.DISPONIBLE
        );
        entityManager.persistAndFlush(oldAsset);

        Asset recentAsset = new Asset(
            "ACT-REC-001",
            "Switch Cisco Catalyst 2960",
            AssetCategory.REDES_TI,
            "Cisco",
            "WS-C2960X",
            "SN-SW-01",
            "Pasillo C - Estante 1",
            new BigDecimal("4200000.00"),
            LocalDate.now().minusMonths(2),
            LocalDate.now().minusDays(20), // Recent
            AssetStatus.DISPONIBLE
        );
        entityManager.persistAndFlush(recentAsset);

        List<Asset> oldAssets = assetRepository.findByLastInspectionDateBefore(cutoff);

        assertThat(oldAssets).isNotEmpty();
        assertThat(oldAssets).extracting(Asset::getAssetTag).contains("ACT-OLD-001");
        assertThat(oldAssets).extracting(Asset::getAssetTag).doesNotContain("ACT-REC-001");
    }
}
