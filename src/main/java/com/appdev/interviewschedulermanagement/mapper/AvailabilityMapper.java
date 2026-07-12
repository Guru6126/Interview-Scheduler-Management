package com.appdev.interviewschedulermanagement.mapper;

import com.appdev.interviewschedulermanagement.dto.AvailabilityRequest;
import com.appdev.interviewschedulermanagement.dto.AvailabilityResponse;
import com.appdev.interviewschedulermanagement.model.Availability;
import com.appdev.interviewschedulermanagement.model.User;
import org.springframework.stereotype.Component;

@Component
public class AvailabilityMapper {

    public Availability toEntity(AvailabilityRequest request, User interviewer) {
        if (request == null) {
            return null;
        }

        Availability availability = new Availability();
        availability.setInterviewer(interviewer);
        availability.setStartTime(request.getStartTime());
        availability.setEndTime(request.getEndTime());
        availability.setStatus(request.getStatus());

        return availability;
    }

    public AvailabilityResponse toResponse(Availability entity) {
        if (entity == null) {
            return null;
        }

        AvailabilityResponse response = new AvailabilityResponse();
        response.setId(entity.getId());
        response.setStartTime(entity.getStartTime());
        response.setEndTime(entity.getEndTime());
        response.setStatus(entity.getStatus());
        response.setCreatedDate(entity.getCreatedDate());

        if (entity.getInterviewer() != null) {
            response.setInterviewerId(entity.getInterviewer().getId());
            response.setInterviewerUsername(entity.getInterviewer().getUsername());
        }

        return response;
    }
}