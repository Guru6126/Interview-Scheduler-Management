package com.appdev.interviewschedulermanagement.mapper;

import com.appdev.interviewschedulermanagement.dto.JobPositionRequest;
import com.appdev.interviewschedulermanagement.dto.JobPositionResponse;
import com.appdev.interviewschedulermanagement.model.JobPosition;
import com.appdev.interviewschedulermanagement.model.User;
import org.springframework.stereotype.Component;

@Component
public class JobPositionMapper {

    public JobPosition toEntity(JobPositionRequest request, User creator) {
        if (request == null) {
            return null;
        }

        JobPosition job = new JobPosition();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setDepartment(request.getDepartment());
        job.setLocation(request.getLocation());
        job.setStatus(request.getStatus());
        job.setCreatedBy(creator);

        return job;
    }

    public JobPositionResponse toResponse(JobPosition entity) {
        if (entity == null) {
            return null;
        }

        JobPositionResponse response = new JobPositionResponse();
        response.setId(entity.getId());
        response.setTitle(entity.getTitle());
        response.setDescription(entity.getDescription());
        response.setDepartment(entity.getDepartment());
        response.setLocation(entity.getLocation());
        response.setStatus(entity.getStatus());
        response.setCreatedDate(entity.getCreatedDate());

        if (entity.getCreatedBy() != null) {
            response.setCreatedById(entity.getCreatedBy().getId());
            response.setCreatedByUsername(entity.getCreatedBy().getUsername());
        }

        return response;
    }
}