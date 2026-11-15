package com.bodegacore.config;

import com.bodegacore.model.Asset;
import com.bodegacore.model.AssetCategory;
import com.bodegacore.model.AssetStatus;
import com.bodegacore.model.Custodian;
import com.bodegacore.repository.AssetRepository;
import com.bodegacore.repository.CustodianRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

/**
 * Preloads the in-memory H2 database with exactly 20 realistic assets and 4 custodians
 * for testing and laboratory demonstration.
 */
@Configuration
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final AssetRepository assetRepository;
    private final CustodianRepository custodianRepository;

    public DataInitializer(AssetRepository assetRepository, CustodianRepository custodianRepository) {
        this.assetRepository = assetRepository;
        this.custodianRepository = custodianRepository;
    }

    @Override
    public void run(String... args) {
        if (assetRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial data load.");
            return;
        }

        log.info("Starting warehouse asset seed data preload into H2 database...");

        // 1. Preload 4 Custodians
        Custodian carlos = custodianRepository.save(new Custodian("Ing. Carlos Mendoza", "Operaciones TI", "carlos.mendoza@bodegacore.com"));
        Custodian laura = custodianRepository.save(new Custodian("Arq. Laura Restrepo", "Infraestructura y Redes", "laura.restrepo@bodegacore.com"));
        Custodian andres = custodianRepository.save(new Custodian("Tec. Andrés Gómez", "Mantenimiento Electromecánico", "andres.gomez@bodegacore.com"));
        Custodian sofia = custodianRepository.save(new Custodian("Dra. Sofia Valencia", "Control de Calidad", "sofia.valencia@bodegacore.com"));

        LocalDate now = LocalDate.now();

        // 2. Preload 20 Assets
        List<Asset> seedAssets = Arrays.asList(
            // --- 10 DISPONIBLES ---
            new Asset("ACT-001", "ThinkPad T14 Gen 3", AssetCategory.COMPUTO, "Lenovo", "T14-G3", "SN-LN-001",
                "Pasillo A - Estante 1", new BigDecimal("5400000.00"), now.minusMonths(6), now.minusDays(20), AssetStatus.DISPONIBLE),
            new Asset("ACT-002", "Dell Latitude 5430", AssetCategory.COMPUTO, "Dell", "LAT-5430", "SN-DL-002",
                "Pasillo A - Estante 1", new BigDecimal("4800000.00"), now.minusMonths(4), now.minusDays(15), AssetStatus.DISPONIBLE),
            new Asset("ACT-003", "Multímetro Digital Fluke 87V", AssetCategory.HERRAMIENTAS, "Fluke", "87V-MAX", "SN-FK-003",
                "Pasillo B - Estante 2", new BigDecimal("2150000.00"), now.minusMonths(8), now.minusDays(25), AssetStatus.DISPONIBLE),
            new Asset("ACT-004", "Calibrador Pie de Rey Digital", AssetCategory.HERRAMIENTAS, "Mitutoyo", "500-196-30", "SN-MT-004",
                "Pasillo B - Estante 1", new BigDecimal("950000.00"), now.minusMonths(3), now.minusDays(10), AssetStatus.DISPONIBLE),
            new Asset("ACT-005", "Taladro Percutor Inalámbrico 18V", AssetCategory.HERRAMIENTAS, "Bosch", "GSB-18V-50", "SN-BS-005",
                "Pasillo B - Estante 3", new BigDecimal("1250000.00"), now.minusMonths(5), now.minusDays(30), AssetStatus.DISPONIBLE),
            new Asset("ACT-006", "Switch Catalyst 2960X 24P", AssetCategory.REDES_TI, "Cisco", "WS-C2960X-24TS", "SN-CS-006",
                "Pasillo C - Estante 1", new BigDecimal("6800000.00"), now.minusMonths(9), now.minusDays(14), AssetStatus.DISPONIBLE),
            new Asset("ACT-007", "Router Cloud Core CCR1036", AssetCategory.REDES_TI, "MikroTik", "CCR1036-8G-2S+", "SN-MK-007",
                "Pasillo C - Estante 2", new BigDecimal("4300000.00"), now.minusMonths(7), now.minusDays(40), AssetStatus.DISPONIBLE),
            new Asset("ACT-008", "Access Point UniFi U6 Pro", AssetCategory.REDES_TI, "Ubiquiti", "U6-PRO", "SN-UB-008",
                "Pasillo C - Estante 3", new BigDecimal("1100000.00"), now.minusMonths(2), now.minusDays(5), AssetStatus.DISPONIBLE),
            new Asset("ACT-009", "Bomba Sumergible de Achique 1HP", AssetCategory.MAQUINARIA_LIVIANA, "Truper", "BOS-1HP", "SN-TR-009",
                "Pasillo D - Nivel Suelo", new BigDecimal("1850000.00"), now.minusMonths(10), now.minusDays(95), AssetStatus.DISPONIBLE), // >90d
            new Asset("ACT-010", "Compresor de Aire Portátil 50L", AssetCategory.MAQUINARIA_LIVIANA, "Stanley", "D200-8-50", "SN-ST-010",
                "Pasillo D - Nivel Suelo", new BigDecimal("2400000.00"), now.minusMonths(11), now.minusDays(110), AssetStatus.DISPONIBLE), // >90d

            // --- 6 ASIGNADOS ---
            createAssignedAsset("ACT-011", "MacBook Pro 14 M2", AssetCategory.COMPUTO, "Apple", "MBP-14-M2", "SN-AP-011",
                "Oficina 302", new BigDecimal("9200000.00"), now.minusMonths(5), now.minusDays(30), carlos),
            createAssignedAsset("ACT-012", "Estación de Trabajo Z2 G9", AssetCategory.COMPUTO, "HP", "Z2-G9", "SN-HP-012",
                "Laboratorio TI", new BigDecimal("7600000.00"), now.minusMonths(8), now.minusDays(45), carlos),
            createAssignedAsset("ACT-013", "Fusionadora de Fibra Óptica", AssetCategory.REDES_TI, "Fujikura", "90S+", "SN-FJ-013",
                "Cuadrilla Redes", new BigDecimal("14500000.00"), now.minusMonths(14), now.minusDays(130), laura), // >90d
            createAssignedAsset("ACT-014", "Certificador de Cableado Cat 6A", AssetCategory.REDES_TI, "Fluke Networks", "DSX-602", "SN-FL-014",
                "Cuadrilla Redes", new BigDecimal("12800000.00"), now.minusMonths(12), now.minusDays(50), laura),
            createAssignedAsset("ACT-015", "Llave Dinamométrica Digital", AssetCategory.HERRAMIENTAS, "Snap-on", "ATECH3FR250B", "SN-SO-015",
                "Taller Mecánico", new BigDecimal("3100000.00"), now.minusMonths(6), now.minusDays(22), andres),
            createAssignedAsset("ACT-016", "Analizador de Calidad de Energía", AssetCategory.HERRAMIENTAS, "Fluke", "435-II", "SN-FK-016",
                "Lab Control Calidad", new BigDecimal("18200000.00"), now.minusMonths(15), now.minusDays(160), sofia), // >90d

            // --- 3 EN MANTENIMIENTO ---
            createMaintenanceAsset("ACT-017", "Osciloscopio Digital 100MHz", AssetCategory.HERRAMIENTAS, "Tektronix", "TBS1102B", "SN-TK-017",
                "Taller Metrología", new BigDecimal("4600000.00"), now.minusMonths(18), now.minusDays(140), // >90d
                "Metrología Andina SAS", "Calibración anual reglamentaria y certificación ISO"),
            createMaintenanceAsset("ACT-018", "Generador Eléctrico a Gasolina 3.5kVA", AssetCategory.MAQUINARIA_LIVIANA, "Hyundai", "HHY3500", "SN-HY-018",
                "Taller Motores", new BigDecimal("3750000.00"), now.minusMonths(8), now.minusDays(100), // >90d
                "Motores del Valle", "Revisión por fuga menor de lubricante en empaque de cárter"),
            createMaintenanceAsset("ACT-019", "Portátil Dell Latitude 5520", AssetCategory.COMPUTO, "Dell", "LAT-5520", "SN-DL-019",
                "Taller Soporte TI", new BigDecimal("4500000.00"), now.minusMonths(20), now.minusDays(12),
                "Soporte Dell Pro", "Reemplazo de celda de batería por desgaste acelerado"),

            // --- 1 DE BAJA ---
            new Asset("ACT-020", "Servidor IBM System x3650 M3", AssetCategory.COMPUTO, "IBM", "x3650-M3", "SN-IBM-020",
                "Depósito de Bajas", new BigDecimal("11500000.00"), now.minusYears(6), now.minusDays(400), AssetStatus.DE_BAJA)
        );

        assetRepository.saveAll(seedAssets);
        log.info("Successfully seeded exactly {} assets across all 4 operational states.", seedAssets.size());
    }

    private Asset createAssignedAsset(String tag, String name, AssetCategory cat, String brand, String model,
                                     String sn, String loc, BigDecimal cost, LocalDate purchase, LocalDate inspection,
                                     Custodian custodian) {
        Asset asset = new Asset(tag, name, cat, brand, model, sn, loc, cost, purchase, inspection, AssetStatus.ASIGNADO);
        asset.setCustodian(custodian);
        return asset;
    }

    private Asset createMaintenanceAsset(String tag, String name, AssetCategory cat, String brand, String model,
                                         String sn, String loc, BigDecimal cost, LocalDate purchase, LocalDate inspection,
                                         String provider, String reason) {
        Asset asset = new Asset(tag, name, cat, brand, model, sn, loc, cost, purchase, inspection, AssetStatus.EN_MANTENIMIENTO);
        asset.setServiceProvider(provider);
        asset.setMaintenanceReason(reason);
        return asset;
    }
}
