package com.aiinvoice.dto.estimate;

import java.math.BigDecimal;

public record EstimateLineItemResponse(
        Long measurementId,
        String type,
        String material,
        BigDecimal length,
        BigDecimal width,
        BigDecimal area,
        BigDecimal ratePerSqft,
        BigDecimal baseCost
) {
}
