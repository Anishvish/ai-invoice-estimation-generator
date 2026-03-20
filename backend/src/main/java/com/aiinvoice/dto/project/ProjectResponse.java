package com.aiinvoice.dto.project;

import java.time.LocalDateTime;

public record ProjectResponse(
        Long id,
        String name,
        String clientName,
        Long companyId,
        String companyName,
        Boolean gstEnabled,
        LocalDateTime createdAt
) {
}
