package com.aiinvoice.dto.estimate;

import java.math.BigDecimal;

public record EstimateLineItemResponse(
        Long measurementId,
        String type,
        String material,
        Integer lengthFeet,
        Integer lengthInches,
        Integer widthFeet,
        Integer widthInches,
        Integer quantity,
        BigDecimal unitArea,
        BigDecimal area,
        BigDecimal ratePerSqft,
        BigDecimal baseCost
) {
}
