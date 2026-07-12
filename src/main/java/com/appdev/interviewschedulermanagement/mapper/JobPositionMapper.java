package com.appdev.interviewschedulermanagement.mapper;

import com.appdev.interviewschedulermanagement.dto.JobPositionRequest;
import com.appdev.interviewschedulermanagement.dto.JobPositionResponse;
import com.appdev.interviewschedulermanagement.model.JobPosition;
import com.appdev.interviewschedulermanagement.model.User;
import org.springframework.stereotype.Component;

@Component
public class JobPositionMapper {

    public JobPosition toEntity(JobPositionRequest request, User creator) {
        JobPosition job = new JobPosition();
        job.setCreator(creator);
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setDepartment(request.getDepartment());
        job.setLocation(request.getLocation());
        job.setEmploymentType(request.getEmploymentType());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setRequirements(request.getRequirements());
        job.setResponsibilities(request.getResponsibilities());
        job.setStatus(request.getStatus());
        return job;
    }

    public JobPositionResponse toResponse(JobPosition entity) {
        JobPositionResponse response = new JobPositionResponse();
        response.setId(entity.getId());
        response.setCreatorId(entity.getCreator().getId());
        response.setCreatorName(entity.getCreator().getFirstName() + " " + entity.getCreator().getLastName());
        response.setTitle(entity.getTitle());
        response.setDescription(entity.getDescription());
        response.setDepartment(entity.getDepartment());
        response.setLocation(entity.getLocation());
        response.setEmploymentType(entity.getEmploymentType());
        response.setSalaryMin(entity.getSalaryMin());
        response.setSalaryMax(entity.getSalaryMax());
        response.setRequirements(entity.getRequirements());
        response.setResponsibilities(entity.getResponsibilities());
        response.setStatus(entity.getStatus());
        response.setCreatedDate(entity.getCreatedDate());
        response.setUpdatedDate(entity.getUpdatedDate());
        return response;
    }
}