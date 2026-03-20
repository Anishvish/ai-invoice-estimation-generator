package com.aiinvoice.dto.company;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CompanyRequest(
        @NotBlank(message = "Company name is required") String name,
        @NotNull(message = "GST flag is required") Boolean gstEnabled,
        String gstin
) {
}
