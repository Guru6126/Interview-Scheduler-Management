package com.appdev.interviewschedulermanagement.mapper;

import com.appdev.interviewschedulermanagement.dto.InterviewRequest;
import com.appdev.interviewschedulermanagement.dto.InterviewResponse;
import com.appdev.interviewschedulermanagement.model.*;
import org.springframework.stereotype.Component;

@Component
public class InterviewMapper {

    public Interview toEntity(InterviewRequest request, Candidate candidate, JobPosition job, User interviewer, User organizer) {
        if (request == null) {
            return null;
        }

        Interview interview = new Interview();
        interview.setCandidate(candidate);
        interview.setJobPosition(job);
        interview.setInterviewer(interviewer);
        interview.setOrganizedBy(organizer);
        interview.setScheduledTime(request.getScheduledTime());
        interview.setStatus(request.getStatus());
        interview.setMeetingLink(request.getMeetingLink());

        return interview;
    }

    public InterviewResponse toResponse(Interview entity) {
        if (entity == null) {
            return null;
        }

        InterviewResponse response = new InterviewResponse();
        response.setId(entity.getId());
        response.setScheduledTime(entity.getScheduledTime());
        response.setStatus(entity.getStatus());
        response.setMeetingLink(entity.getMeetingLink());
        response.setCreatedDate(entity.getCreatedDate());

        if (entity.getCandidate() != null) {
            response.setCandidateId(entity.getCandidate().getId());
            response.setCandidateName(entity.getCandidate().getFirstName() + " " + entity.getCandidate().getLastName());
        }
        if (entity.getJobPosition() != null) {
            response.setJobPositionId(entity.getJobPosition().getId());
            response.setJobPositionTitle(entity.getJobPosition().getTitle());
        }
        if (entity.getInterviewer() != null) {
            response.setInterviewerId(entity.getInterviewer().getId());
            response.setInterviewerName(entity.getInterviewer().getFirstName() + " " + entity.getInterviewer().getLastName());
        }
        if (entity.getOrganizedBy() != null) {
            response.setOrganizedById(entity.getOrganizedBy().getId());
            response.setOrganizedByName(entity.getOrganizedBy().getFirstName() + " " + entity.getOrganizedBy().getLastName());
        }

        return response;
    }
}