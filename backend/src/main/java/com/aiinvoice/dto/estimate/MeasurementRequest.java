package com.aiinvoice.dto.estimate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record MeasurementRequest(
        @NotBlank(message = "Measurement type is required") String type,
        @NotNull @Min(value = 0, message = "Length feet cannot be negative") Integer lengthFeet,
        @NotNull @Min(value = 0, message = "Length inches cannot be negative") Integer lengthInches,
        @NotNull @Min(value = 0, message = "Width feet cannot be negative") Integer widthFeet,
        @NotNull @Min(value = 0, message = "Width inches cannot be negative") Integer widthInches,
        @NotNull @Min(value = 1, message = "Quantity must be at least one") Integer quantity,
        @NotBlank(message = "Material is required") String material,
        @NotNull @DecimalMin(value = "0.01", message = "Rate must be greater than zero") BigDecimal ratePerSqft
) {
}
