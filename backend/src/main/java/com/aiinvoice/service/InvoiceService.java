package com.aiinvoice.service;

import com.aiinvoice.dto.invoice.InvoiceGenerateRequest;
import com.aiinvoice.dto.invoice.InvoiceResponse;
import com.aiinvoice.exception.BusinessException;
import com.aiinvoice.exception.ResourceNotFoundException;
import com.aiinvoice.model.Company;
import com.aiinvoice.model.Estimate;
import com.aiinvoice.model.Invoice;
import com.aiinvoice.repository.EstimateRepository;
import com.aiinvoice.repository.InvoiceRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final EstimateRepository estimateRepository;
    private final InvoiceRepository invoiceRepository;
    private final PdfGeneratorService pdfGeneratorService;

    @Transactional
    public InvoiceResponse generateInvoice(InvoiceGenerateRequest request) {
        Estimate estimate = estimateRepository.findById(request.estimateId())
                .orElseThrow(() -> new ResourceNotFoundException("Estimate not found: " + request.estimateId()));
        Company company = estimate.getProject().getCompany();

        BigDecimal taxableAmount = scale(estimate.getSubtotal()
                .add(estimate.getAdditionalCharges())
                .subtract(estimate.getDiscount()));
        BigDecimal gstAmount = Boolean.TRUE.equals(company.getGstEnabled())
                ? scale(taxableAmount.multiply(new BigDecimal("0.18")))
                : scale(BigDecimal.ZERO);
        BigDecimal totalAmount = scale(taxableAmount.add(gstAmount));
        BigDecimal advancePayment = scale(request.advancePayment());
        if (advancePayment.compareTo(totalAmount) > 0) {
            throw new BusinessException("Advance payment cannot exceed invoice total");
        }

        Invoice invoice = new Invoice();
        invoice.setEstimate(estimate);
        invoice.setInvoiceNumber(buildInvoiceNumber(estimate.getId()));
        invoice.setCompanyName(company.getName());
        invoice.setCompanyGstin(company.getGstin());
        invoice.setGstApplied(company.getGstEnabled());
        invoice.setGstAmount(gstAmount);
        invoice.setSubtotal(taxableAmount);
        invoice.setTotalAmount(totalAmount);
        invoice.setAdvancePayment(advancePayment);
        invoice.setBalanceDue(scale(totalAmount.subtract(advancePayment)));
        invoice.setGeneratedAt(LocalDateTime.now());
        invoice.setFilePath(pdfGeneratorService.generateInvoicePdf(invoice.getInvoiceNumber(), estimate, invoice));

        Invoice savedInvoice = invoiceRepository.save(invoice);
        return mapToResponse(savedInvoice);
    }

    public Path getInvoiceFile(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + invoiceId));
        return Path.of(invoice.getFilePath());
    }

    private InvoiceResponse mapToResponse(Invoice invoice) {
        return new InvoiceResponse(
                invoice.getId(),
                invoice.getInvoiceNumber(),
                buildDownloadUrl(invoice.getId()),
                invoice.getCompanyName(),
                maskGstin(invoice.getCompanyGstin()),
                invoice.getGstApplied(),
                invoice.getEstimate().getProject().getClientName(),
                invoice.getSubtotal(),
                invoice.getGstAmount(),
                invoice.getTotalAmount(),
                invoice.getAdvancePayment(),
                invoice.getBalanceDue(),
                invoice.getGeneratedAt()
        );
    }

    private String buildInvoiceNumber(Long estimateId) {
        return "INV-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmm")) + "-" + estimateId;
    }

    private String buildDownloadUrl(Long invoiceId) {
        return "/invoice/" + invoiceId + "/download";
    }

    private BigDecimal scale(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    private String maskGstin(String gstin) {
        if (gstin == null || gstin.isBlank()) {
            return null;
        }
        if (gstin.length() <= 4) {
            return gstin;
        }
        return "*".repeat(gstin.length() - 4) + gstin.substring(gstin.length() - 4);
    }
}
