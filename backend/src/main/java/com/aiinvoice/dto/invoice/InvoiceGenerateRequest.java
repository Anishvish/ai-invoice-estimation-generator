package com.aiinvoice.dto.invoice;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record InvoiceGenerateRequest(
        @NotNull(message = "Estimate ID is required") Long estimateId,
        @NotNull @DecimalMin(value = "0.00", message = "Advance payment cannot be negative") BigDecimal advancePayment
) {
}
