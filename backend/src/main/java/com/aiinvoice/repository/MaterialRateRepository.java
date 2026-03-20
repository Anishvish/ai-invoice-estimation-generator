package com.aiinvoice.repository;

import com.aiinvoice.model.MaterialRate;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialRateRepository extends JpaRepository<MaterialRate, Long> {

    Optional<MaterialRate> findByMaterialIgnoreCase(String material);
}
