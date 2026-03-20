package com.aiinvoice.controller;

import com.aiinvoice.dto.invoice.InvoiceGenerateRequest;
import com.aiinvoice.dto.invoice.InvoiceResponse;
import com.aiinvoice.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
}
