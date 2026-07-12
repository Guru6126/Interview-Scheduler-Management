package com.appdev.interviewschedulermanagement.mapper;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.model.*;
import org.springframework.stereotype.Component;

@Component
public class JobApplicationMapper {
    public JobApplication toEntity(JobApplicationRequest req, Candidate c, JobPosition j) {
        JobApplication app = new JobApplication();
        app.setCandidate(c);
        app.setJobPosition(j);
        return app;
    }

    public JobApplicationResponse toResponse(JobApplication e) {
        JobApplicationResponse r = new JobApplicationResponse();
        r.setId(e.getId());
        r.setCandidateId(e.getCandidate().getId());
        r.setCandidateName(e.getCandidate().getFirstName() + " " + e.getCandidate().getLastName());
        r.setJobPositionId(e.getJobPosition().getId());
        r.setJobPositionTitle(e.getJobPosition().getTitle());
        r.setAppliedDate(e.getAppliedDate());
        r.setStatus(e.getStatus());
        return r;
    }
}