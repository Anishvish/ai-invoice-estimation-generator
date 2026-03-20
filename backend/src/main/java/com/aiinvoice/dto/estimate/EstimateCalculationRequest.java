package com.aiinvoice.dto.estimate;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public record EstimateCalculationRequest(
        @NotNull(message = "Project ID is required") Long projectId,
        @Valid @NotEmpty(message = "At least one measurement item is required") List<MeasurementRequest> measurements,
        @NotNull @DecimalMin(value = "0.00", message = "Additional charges cannot be negative") BigDecimal additionalCharges,
        @NotNull @DecimalMin(value = "0.00", message = "Discount cannot be negative") BigDecimal discount
) {
}
