package com.aiinvoice.repository;

import com.aiinvoice.model.Invoice;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByEstimateId(Long estimateId);
}
