package com.aiinvoice.dto.ai;

import jakarta.validation.constraints.NotBlank;

public record AiParseRequest(@NotBlank(message = "Input text is required") String input) {
}
