package com.aiinvoice.service;

import com.aiinvoice.dto.estimate.EstimateCalculationRequest;
import com.aiinvoice.dto.estimate.EstimateLineItemResponse;
import com.aiinvoice.dto.estimate.EstimateResponse;
import com.aiinvoice.dto.estimate.MeasurementRequest;
import com.aiinvoice.exception.BusinessException;
import com.aiinvoice.exception.ResourceNotFoundException;
import com.aiinvoice.model.Estimate;
import com.aiinvoice.model.Measurement;
import com.aiinvoice.model.Project;
import com.aiinvoice.repository.EstimateRepository;
import com.aiinvoice.repository.MeasurementRepository;
import com.aiinvoice.repository.ProjectRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EstimateService {

    private static final BigDecimal GST_PERCENTAGE = new BigDecimal("18.00");
    private static final BigDecimal GST_MULTIPLIER = new BigDecimal("0.18");

    private final ProjectRepository projectRepository;
    private final MeasurementRepository measurementRepository;
    private final EstimateRepository estimateRepository;

    @Transactional
    public EstimateResponse calculateEstimate(EstimateCalculationRequest request) {
        Project project = projectRepository.findById(request.projectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + request.projectId()));

        Estimate estimate = new Estimate();
        estimate.setProject(project);
        estimate.setTotalArea(scale(BigDecimal.ZERO));
        estimate.setSubtotal(scale(BigDecimal.ZERO));
        estimate.setAdditionalCharges(scale(request.additionalCharges()));
        estimate.setDiscount(scale(request.discount()));
        estimate.setGstPercentage(GST_PERCENTAGE);
        estimate.setGstAmount(scale(BigDecimal.ZERO));
        estimate.setFinalAmount(scale(BigDecimal.ZERO));
        Estimate savedEstimate = estimateRepository.save(estimate);

        List<Measurement> savedMeasurements = request.measurements()
                .stream()
                .map(item -> measurementRepository.save(createMeasurement(project, savedEstimate, item)))
                .toList();

        BigDecimal totalArea = savedMeasurements.stream()
                .map(Measurement::getArea)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal subtotal = savedMeasurements.stream()
                .map(Measurement::getBaseCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal taxableAmount = scale(subtotal.add(savedEstimate.getAdditionalCharges()).subtract(savedEstimate.getDiscount()));
        if (taxableAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException("Discount cannot exceed subtotal plus additional charges");
        }
        BigDecimal gstAmount = scale(taxableAmount.multiply(GST_MULTIPLIER));
        BigDecimal finalAmount = scale(taxableAmount.add(gstAmount));

        savedEstimate.setTotalArea(scale(totalArea));
        savedEstimate.setSubtotal(scale(subtotal));
        savedEstimate.setGstAmount(gstAmount);
        savedEstimate.setFinalAmount(finalAmount);
        Estimate updatedEstimate = estimateRepository.save(savedEstimate);

        updatedEstimate.setMeasurements(savedMeasurements);

        return mapToResponse(updatedEstimate);
    }

    private Measurement createMeasurement(Project project, Estimate estimate, MeasurementRequest request) {
        int totalLengthInches = toTotalInches(request.lengthFeet(), request.lengthInches());
        int totalWidthInches = toTotalInches(request.widthFeet(), request.widthInches());
        if (totalLengthInches <= 0 || totalWidthInches <= 0) {
            throw new BusinessException("Length and width must be greater than zero");
        }

        Measurement measurement = new Measurement();
        measurement.setProject(project);
        measurement.setEstimate(estimate);
        measurement.setType(request.type().trim().toLowerCase());
        measurement.setLengthInches(totalLengthInches);
        measurement.setWidthInches(totalWidthInches);
        measurement.setQuantity(request.quantity());
        measurement.setMaterial(request.material().trim().toLowerCase());
        measurement.setRatePerSqft(scale(request.ratePerSqft()));
        BigDecimal unitArea = scale(BigDecimal.valueOf(totalLengthInches)
                .multiply(BigDecimal.valueOf(totalWidthInches))
                .divide(BigDecimal.valueOf(144), 2, RoundingMode.HALF_UP));
        BigDecimal totalArea = scale(unitArea.multiply(BigDecimal.valueOf(request.quantity())));
        measurement.setUnitArea(unitArea);
        measurement.setArea(totalArea);
        measurement.setBaseCost(scale(totalArea.multiply(measurement.getRatePerSqft())));
        return measurement;
    }

    private EstimateResponse mapToResponse(Estimate estimate) {
        Project project = estimate.getProject();
        List<EstimateLineItemResponse> items = estimate.getMeasurements()
                .stream()
                .map(measurement -> new EstimateLineItemResponse(
                        measurement.getId(),
                        measurement.getType(),
                        measurement.getMaterial(),
                        measurement.getLengthInches() / 12,
                        measurement.getLengthInches() % 12,
                        measurement.getWidthInches() / 12,
                        measurement.getWidthInches() % 12,
                        measurement.getQuantity(),
                        measurement.getUnitArea(),
                        measurement.getArea(),
                        measurement.getRatePerSqft(),
                        measurement.getBaseCost()
                ))
                .toList();
        return new EstimateResponse(
                estimate.getId(),
                project.getId(),
                project.getName(),
                project.getClientName(),
                project.getCompany().getName(),
                items,
                estimate.getTotalArea(),
                estimate.getSubtotal(),
                estimate.getAdditionalCharges(),
                estimate.getDiscount(),
                estimate.getGstPercentage(),
                estimate.getGstAmount(),
                estimate.getFinalAmount()
        );
    }

    private BigDecimal scale(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    private int toTotalInches(Integer feet, Integer inches) {
        return (feet * 12) + inches;
    }
}
