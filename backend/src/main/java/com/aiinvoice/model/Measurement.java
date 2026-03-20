package com.aiinvoice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "measurements")
public class Measurement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estimate_id")
    private Estimate estimate;

    @Column(nullable = false)
    private String type;

    @Column(name = "length_inches", nullable = false)
    private Integer lengthInches;

    @Column(name = "width_inches", nullable = false)
    private Integer widthInches;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private String material;

    @Column(name = "rate_per_sqft", nullable = false, precision = 12, scale = 2)
    private BigDecimal ratePerSqft;

    @Column(name = "unit_area", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitArea;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal area;

    @Column(name = "base_cost", nullable = false, precision = 12, scale = 2)
    private BigDecimal baseCost;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
