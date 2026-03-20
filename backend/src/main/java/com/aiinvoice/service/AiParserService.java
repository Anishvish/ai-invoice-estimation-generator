package com.aiinvoice.service;

import com.aiinvoice.dto.ai.AiParseRequest;
import com.aiinvoice.dto.ai.AiParseResponse;
import com.aiinvoice.exception.BusinessException;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;

@Service
public class AiParserService {

    private static final Pattern DIMENSION_PATTERN =
            Pattern.compile("(\\d+(?:\\.\\d+)?)\\s*(?:x|by)\\s*(\\d+(?:\\.\\d+)?)", Pattern.CASE_INSENSITIVE);

    public AiParseResponse parseMeasurement(AiParseRequest request) {
        String rawInput = request.input().trim();
        String normalized = rawInput.toLowerCase(Locale.ROOT);

        Matcher matcher = DIMENSION_PATTERN.matcher(normalized);
        if (!matcher.find()) {
            throw new BusinessException("Could not parse measurement dimensions from input");
        }

        int lengthFeet = (int) Double.parseDouble(matcher.group(1));
        int widthFeet = (int) Double.parseDouble(matcher.group(2));

        return new AiParseResponse(
                extractType(normalized),
                lengthFeet,
                0,
                widthFeet,
                0,
                extractMaterial(normalized),
                rawInput,
                "mock-nlp-parser"
        );
    }

    private String extractMaterial(String input) {
        if (input.contains("laminate")) {
            return "laminate";
        }
        if (input.contains("plywood")) {
            return "plywood";
        }
        if (input.contains("acrylic")) {
            return "acrylic";
        }
        if (input.contains("veneer")) {
            return "veneer";
        }
        return "standard";
    }

    private String extractType(String input) {
        if (input.contains("wardrobe")) {
            return "wardrobe";
        }
        if (input.contains("kitchen")) {
            return "kitchen";
        }
        if (input.contains("tv unit")) {
            return "tv unit";
        }
        if (input.contains("cabinet")) {
            return "cabinet";
        }
        return "custom";
    }
}
