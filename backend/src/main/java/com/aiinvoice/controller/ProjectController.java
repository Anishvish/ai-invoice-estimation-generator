package com.aiinvoice.controller;

import com.aiinvoice.dto.project.ProjectRequest;
import com.aiinvoice.dto.project.ProjectResponse;
import com.aiinvoice.service.ProjectService;
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
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse createProject(@Valid @RequestBody ProjectRequest request) {
        return projectService.createProject(request);
    }

    @GetMapping
    public List<ProjectResponse> getProjects() {
        return projectService.getProjects();
    }
}
