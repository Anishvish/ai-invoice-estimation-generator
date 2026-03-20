package com.aiinvoice.dto.estimate;

import java.math.BigDecimal;
import java.util.List;

public record EstimateResponse(
        Long estimateId,
        Long projectId,
        String projectName,
        String clientName,
        List<EstimateLineItemResponse> items,
        BigDecimal totalArea,
        BigDecimal subtotal,
        BigDecimal additionalCharges,
        BigDecimal discount,
        BigDecimal gstPercentage,
        BigDecimal gstAmount,
        BigDecimal finalAmount
) {
}
