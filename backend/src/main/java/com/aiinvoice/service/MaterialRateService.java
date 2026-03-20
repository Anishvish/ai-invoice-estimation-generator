package com.aiinvoice.service;

import com.aiinvoice.dto.material.MaterialRateRequest;
import com.aiinvoice.dto.material.MaterialRateResponse;
import com.aiinvoice.model.MaterialRate;
import com.aiinvoice.repository.MaterialRateRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MaterialRateService {

    private final MaterialRateRepository materialRateRepository;

    public List<MaterialRateResponse> getAll() {
        return materialRateRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public MaterialRateResponse create(MaterialRateRequest request) {
        MaterialRate materialRate = new MaterialRate();
        materialRate.setCategory(request.category().trim().toLowerCase());
        materialRate.setMaterial(request.material().trim().toLowerCase());
        materialRate.setDefaultRatePerSqft(request.defaultRatePerSqft());
        return mapToResponse(materialRateRepository.save(materialRate));
    }

    private MaterialRateResponse mapToResponse(MaterialRate materialRate) {
        return new MaterialRateResponse(
                materialRate.getId(),
                materialRate.getCategory(),
                materialRate.getMaterial(),
                materialRate.getDefaultRatePerSqft()
        );
    }
}
