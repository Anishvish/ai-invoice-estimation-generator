package com.aiinvoice.dto.company;

public record CompanyResponse(
        Long id,
        String name,
        Boolean gstEnabled,
        String gstinMasked
) {
}
