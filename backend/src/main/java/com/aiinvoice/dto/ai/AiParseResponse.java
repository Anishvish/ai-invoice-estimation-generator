package com.aiinvoice.dto.ai;

import java.math.BigDecimal;

public record AiParseResponse(
        String type,
        Integer lengthFeet,
        Integer lengthInches,
        Integer widthFeet,
        Integer widthInches,
        String material,
        String rawInput,
        String provider
) {
}
