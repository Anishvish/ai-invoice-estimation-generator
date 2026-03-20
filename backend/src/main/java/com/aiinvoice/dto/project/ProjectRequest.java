package com.aiinvoice.dto.project;

import jakarta.validation.constraints.NotBlank;

public record ProjectRequest(
        @NotBlank(message = "Project name is required") String name,
        @NotBlank(message = "Client name is required") String clientName
) {
}
