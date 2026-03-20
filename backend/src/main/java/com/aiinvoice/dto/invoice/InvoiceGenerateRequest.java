package com.aiinvoice.dto.invoice;

import jakarta.validation.constraints.NotNull;

public record InvoiceGenerateRequest(
        @NotNull(message = "Estimate ID is required") Long estimateId
) {
}
