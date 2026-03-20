package com.aiinvoice.controller;

import com.aiinvoice.dto.estimate.EstimateCalculationRequest;
import com.aiinvoice.dto.estimate.EstimateResponse;
import com.aiinvoice.service.EstimateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/estimate")
@RequiredArgsConstructor
public class EstimateController {

    private final EstimateService estimateService;

    @PostMapping("/calculate")
    public EstimateResponse calculate(@Valid @RequestBody EstimateCalculationRequest request) {
        return estimateService.calculateEstimate(request);
    }
}
