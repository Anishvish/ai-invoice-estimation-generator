package com.aiinvoice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estimate_id", nullable = false, unique = true)
    private Estimate estimate;

    @Column(name = "invoice_number", nullable = false, unique = true)
    private String invoiceNumber;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;

    @PrePersist
    void onCreate() {
        generatedAt = LocalDateTime.now();
    }
}
