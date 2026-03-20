package com.aiinvoice.dto.material;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record MaterialRateRequest(
        @NotBlank(message = "Category is required") String category,
        @NotBlank(message = "Material is required") String material,
        @NotNull @DecimalMin(value = "0.01", message = "Rate must be greater than zero") BigDecimal defaultRatePerSqft
) {
}
