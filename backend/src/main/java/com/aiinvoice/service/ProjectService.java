package com.aiinvoice.service;

import com.aiinvoice.dto.project.ProjectRequest;
import com.aiinvoice.dto.project.ProjectResponse;
import com.aiinvoice.model.Company;
import com.aiinvoice.model.Project;
import com.aiinvoice.repository.ProjectRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final CompanyService companyService;

    public ProjectResponse createProject(ProjectRequest request) {
        Company company = companyService.getCompanyById(request.companyId());

        Project project = new Project();
        project.setName(request.name().trim());
        project.setClientName(request.clientName().trim());
        project.setCompany(company);
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
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getClientName(),
                project.getCompany().getId(),
                project.getCompany().getName(),
                project.getCompany().getGstEnabled(),
                project.getCreatedAt()
        );
    }
}
