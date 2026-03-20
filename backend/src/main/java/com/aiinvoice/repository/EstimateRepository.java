package com.aiinvoice.repository;

import com.aiinvoice.model.Estimate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstimateRepository extends JpaRepository<Estimate, Long> {
}
