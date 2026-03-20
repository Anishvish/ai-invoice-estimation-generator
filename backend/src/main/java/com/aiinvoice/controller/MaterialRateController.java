package com.aiinvoice.controller;

import com.aiinvoice.dto.material.MaterialRateRequest;
import com.aiinvoice.dto.material.MaterialRateResponse;
import com.aiinvoice.service.MaterialRateService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/materials")
@RequiredArgsConstructor
public class MaterialRateController {

    private final MaterialRateService materialRateService;

    @GetMapping
    public List<MaterialRateResponse> getMaterials() {
        return materialRateService.getAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MaterialRateResponse createMaterial(@Valid @RequestBody MaterialRateRequest request) {
        return materialRateService.create(request);
    }
}
