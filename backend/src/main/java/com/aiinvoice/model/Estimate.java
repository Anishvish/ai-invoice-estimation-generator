package com.aiinvoice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "estimates")
public class Estimate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @OneToMany(mappedBy = "estimate")
    private List<Measurement> measurements = new ArrayList<>();

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalArea;

    @Column(name = "additional_charges", nullable = false, precision = 12, scale = 2)
    private BigDecimal additionalCharges;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal discount;

    @Column(name = "gst_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal gstPercentage;

    @Column(name = "gst_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal gstAmount;

    @Column(name = "final_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal finalAmount;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
