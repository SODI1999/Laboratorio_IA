package com.bodegacore.repository;

import com.bodegacore.model.Asset;
import com.bodegacore.model.AssetCategory;
import com.bodegacore.model.AssetStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for Asset entities with custom queries for inventory,
 * valuation, status breakdown, and inspection antiquity.
 */
@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {

    Optional<Asset> findByAssetTag(String assetTag);

    boolean existsByAssetTag(String assetTag);

    List<Asset> findByStatus(AssetStatus status);

    List<Asset> findByStatusIn(Collection<AssetStatus> statuses);

    List<Asset> findByCategory(AssetCategory category);

    List<Asset> findByCustodianId(Long custodianId);

    /**
     * Finds assets whose last inspection date is strictly before the given cutoff date (antiquity filter).
     */
    List<Asset> findByLastInspectionDateBefore(LocalDate cutoffDate);

    /**
     * Finds critical assets: either in EN_MANTENIMIENTO or inspected before the cutoff date.
     */
    @Query("SELECT a FROM Asset a WHERE a.status = :maintenanceStatus OR a.lastInspectionDate < :cutoffDate")
    List<Asset> findCriticalAssets(@Param("maintenanceStatus") AssetStatus maintenanceStatus,
                                  @Param("cutoffDate") LocalDate cutoffDate);

    long countByStatus(AssetStatus status);

    long countByCategory(AssetCategory category);

    /**
     * Computes the aggregated monetary valuation of active assets (excluding DE_BAJA).
     */
    @Query("SELECT COALESCE(SUM(a.acquisitionCost), 0) FROM Asset a WHERE a.status <> 'DE_BAJA'")
    BigDecimal calculateTotalValuation();

    /**
     * Dynamic filtering query for the inventory catalog.
     */
    @Query("SELECT a FROM Asset a WHERE " +
           "(:category IS NULL OR a.category = :category) AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:onlyMaintenance = false OR a.status = 'EN_MANTENIMIENTO') AND " +
           "(:onlyOlderThan90 = false OR a.lastInspectionDate < :cutoffDate) AND " +
           "(:search IS NULL OR LOWER(a.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.assetTag) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Asset> searchAssets(@Param("category") AssetCategory category,
                            @Param("status") AssetStatus status,
                            @Param("onlyMaintenance") boolean onlyMaintenance,
                            @Param("onlyOlderThan90") boolean onlyOlderThan90,
                            @Param("cutoffDate") LocalDate cutoffDate,
                            @Param("search") String search);
}
