package com.aiinvoice.controller;

import com.aiinvoice.dto.invoice.InvoiceGenerateRequest;
import com.aiinvoice.dto.invoice.InvoiceResponse;
import com.aiinvoice.service.InvoiceService;
import jakarta.validation.Valid;
import java.nio.file.Path;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/invoice")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping("/generate")
    @ResponseStatus(HttpStatus.CREATED)
    public InvoiceResponse generateInvoice(@Valid @RequestBody InvoiceGenerateRequest request) {
        return invoiceService.generateInvoice(request);
    }

    @GetMapping("/{invoiceId}/download")
    public ResponseEntity<Resource> downloadInvoice(@PathVariable Long invoiceId) {
        Path filePath = invoiceService.getInvoiceFile(invoiceId);
        Resource resource = new FileSystemResource(filePath);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePath.getFileName() + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }
}
