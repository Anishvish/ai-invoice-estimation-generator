package com.aiinvoice.service;

import com.aiinvoice.config.AppProperties;
import com.aiinvoice.dto.invoice.InvoiceGenerateRequest;
import com.aiinvoice.dto.invoice.InvoiceResponse;
import com.aiinvoice.exception.ResourceNotFoundException;
import com.aiinvoice.model.Estimate;
import com.aiinvoice.model.Invoice;
import com.aiinvoice.repository.EstimateRepository;
import com.aiinvoice.repository.InvoiceRepository;
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
    private final AppProperties appProperties;

    @Transactional
    public InvoiceResponse generateInvoice(InvoiceGenerateRequest request) {
        Invoice existingInvoice = invoiceRepository.findByEstimateId(request.estimateId()).orElse(null);
        if (existingInvoice != null) {
            return new InvoiceResponse(
                    existingInvoice.getId(),
                    existingInvoice.getInvoiceNumber(),
                    existingInvoice.getFilePath(),
                    appProperties.companyName(),
                    existingInvoice.getEstimate().getProject().getClientName(),
                    existingInvoice.getEstimate().getFinalAmount(),
                    existingInvoice.getGeneratedAt()
            );
        }

        Estimate estimate = estimateRepository.findById(request.estimateId())
                .orElseThrow(() -> new ResourceNotFoundException("Estimate not found: " + request.estimateId()));

        String invoiceNumber = buildInvoiceNumber(estimate.getId());
        String filePath = pdfGeneratorService.generateInvoicePdf(invoiceNumber, estimate);

        Invoice invoice = new Invoice();
        invoice.setEstimate(estimate);
        invoice.setInvoiceNumber(invoiceNumber);
        invoice.setFilePath(filePath);
        Invoice savedInvoice = invoiceRepository.save(invoice);

        return new InvoiceResponse(
                savedInvoice.getId(),
                savedInvoice.getInvoiceNumber(),
                savedInvoice.getFilePath(),
                appProperties.companyName(),
                estimate.getProject().getClientName(),
                estimate.getFinalAmount(),
                savedInvoice.getGeneratedAt()
        );
    }

    private String buildInvoiceNumber(Long estimateId) {
        return "INV-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmm")) + "-" + estimateId;
    }
}
