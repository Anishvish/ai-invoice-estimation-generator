package com.aiinvoice.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProjectRequest(
        @NotBlank(message = "Project name is required") String name,
        @NotBlank(message = "Client name is required") String clientName,
        @NotNull(message = "Company is required") Long companyId
) {
}
