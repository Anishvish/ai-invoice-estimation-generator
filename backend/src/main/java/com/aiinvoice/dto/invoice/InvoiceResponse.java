package com.aiinvoice.dto.invoice;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record InvoiceResponse(
        Long invoiceId,
        String invoiceNumber,
        String filePath,
        String companyName,
        String clientName,
        BigDecimal finalAmount,
        LocalDateTime generatedAt
) {
}
