package com.aiinvoice.service;

import com.aiinvoice.dto.project.ProjectRequest;
import com.aiinvoice.dto.project.ProjectResponse;
import com.aiinvoice.model.Project;
import com.aiinvoice.repository.ProjectRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectResponse createProject(ProjectRequest request) {
        Project project = new Project();
        project.setName(request.name().trim());
        project.setClientName(request.clientName().trim());
        Project savedProject = projectRepository.save(project);
        return mapToResponse(savedProject);
    }

    public List<ProjectResponse> getProjects() {
        return projectRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ProjectResponse mapToResponse(Project project) {
        return new ProjectResponse(project.getId(), project.getName(), project.getClientName(), project.getCreatedAt());
    }
}
