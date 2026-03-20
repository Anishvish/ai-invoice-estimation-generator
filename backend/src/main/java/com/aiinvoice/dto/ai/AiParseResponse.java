package com.aiinvoice.dto.ai;

import java.math.BigDecimal;

public record AiParseResponse(
        String type,
        BigDecimal length,
        BigDecimal width,
        String material,
        String rawInput,
        String provider
) {
}
