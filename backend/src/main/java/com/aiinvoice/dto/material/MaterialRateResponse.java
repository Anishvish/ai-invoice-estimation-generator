package com.aiinvoice.dto.material;

import java.math.BigDecimal;

public record MaterialRateResponse(
        Long id,
        String category,
        String material,
        BigDecimal defaultRatePerSqft
) {
}
