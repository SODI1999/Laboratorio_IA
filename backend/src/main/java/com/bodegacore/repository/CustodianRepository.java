package com.bodegacore.repository;

import com.bodegacore.model.Custodian;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for Custodian entities.
 */
@Repository
public interface CustodianRepository extends JpaRepository<Custodian, Long> {

    Optional<Custodian> findByEmail(String email);
}
