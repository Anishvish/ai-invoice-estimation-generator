package com.aiinvoice.dto.estimate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record MeasurementRequest(
        @NotBlank(message = "Measurement type is required") String type,
        @NotNull @DecimalMin(value = "0.01", message = "Length must be greater than zero") BigDecimal length,
        @NotNull @DecimalMin(value = "0.01", message = "Width must be greater than zero") BigDecimal width,
        @NotBlank(message = "Material is required") String material,
        @NotNull @DecimalMin(value = "0.01", message = "Rate must be greater than zero") BigDecimal ratePerSqft
) {
}
