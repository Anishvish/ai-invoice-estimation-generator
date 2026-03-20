package com.aiinvoice.repository;

import com.aiinvoice.model.Measurement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeasurementRepository extends JpaRepository<Measurement, Long> {
}
