package com.aiinvoice.dto.invoice;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record InvoiceResponse(
        Long invoiceId,
        String invoiceNumber,
        String downloadUrl,
        String companyName,
        String companyGstinMasked,
        Boolean gstApplied,
        String clientName,
        BigDecimal subtotal,
        BigDecimal gstAmount,
        BigDecimal totalAmount,
        BigDecimal advancePayment,
        BigDecimal balanceDue,
        LocalDateTime generatedAt
) {
}
