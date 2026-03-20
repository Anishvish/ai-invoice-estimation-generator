package com.aiinvoice.service;

import com.aiinvoice.dto.company.CompanyRequest;
import com.aiinvoice.dto.company.CompanyResponse;
import com.aiinvoice.exception.BusinessException;
import com.aiinvoice.exception.ResourceNotFoundException;
import com.aiinvoice.model.Company;
import com.aiinvoice.repository.CompanyRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    public List<CompanyResponse> getCompanies() {
        return companyRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CompanyResponse createCompany(CompanyRequest request) {
        Company company = new Company();
        company.setName(request.name().trim());
        company.setGstEnabled(request.gstEnabled());
        company.setGstin(normalizeGstin(request.gstin(), request.gstEnabled()));
        return mapToResponse(companyRepository.save(company));
    }

    public Company getCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found: " + id));
    }

    private CompanyResponse mapToResponse(Company company) {
        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getGstEnabled(),
                maskGstin(company.getGstin())
        );
    }

    private String normalizeGstin(String gstin, Boolean gstEnabled) {
        if (!Boolean.TRUE.equals(gstEnabled)) {
            return null;
        }
        if (gstin == null || gstin.isBlank()) {
            throw new BusinessException("GSTIN is required when GST is enabled");
        }
        return gstin.trim().toUpperCase();
    }

    public String maskGstin(String gstin) {
        if (gstin == null || gstin.isBlank()) {
            return null;
        }
        if (gstin.length() <= 4) {
            return gstin;
        }
        return "*".repeat(gstin.length() - 4) + gstin.substring(gstin.length() - 4);
    }
}
