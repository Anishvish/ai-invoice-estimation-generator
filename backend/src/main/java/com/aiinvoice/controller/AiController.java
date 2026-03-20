package com.aiinvoice.controller;

import com.aiinvoice.dto.ai.AiParseRequest;
import com.aiinvoice.dto.ai.AiParseResponse;
import com.aiinvoice.service.AiParserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiParserService aiParserService;

    @PostMapping("/parse")
    public AiParseResponse parse(@Valid @RequestBody AiParseRequest request) {
        return aiParserService.parseMeasurement(request);
    }
}
