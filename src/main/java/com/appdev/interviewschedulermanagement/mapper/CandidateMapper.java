package com.appdev.interviewschedulermanagement.mapper;

import com.appdev.interviewschedulermanagement.dto.CandidateRequest;
import com.appdev.interviewschedulermanagement.dto.CandidateResponse;
import com.appdev.interviewschedulermanagement.model.Candidate;
import com.appdev.interviewschedulermanagement.model.User;
import org.springframework.stereotype.Component;

@Component
public class CandidateMapper {

    public Candidate toEntity(CandidateRequest request, User creator) {
        if (request == null) {
            return null;
        }

        Candidate candidate = new Candidate();
        candidate.setFirstName(request.getFirstName());
        candidate.setLastName(request.getLastName());
        candidate.setEmail(request.getEmail());
        candidate.setPhoneNumber(request.getPhoneNumber());
        candidate.setResumeUrl(request.getResumeUrl());
        candidate.setStatus(request.getStatus());
        candidate.setCreatedBy(creator);

        return candidate;
    }

    public CandidateResponse toResponse(Candidate entity) {
        if (entity == null) {
            return null;
        }

        CandidateResponse response = new CandidateResponse();
        response.setId(entity.getId());
        response.setFirstName(entity.getFirstName());
        response.setLastName(entity.getLastName());
        response.setEmail(entity.getEmail());
        response.setPhoneNumber(entity.getPhoneNumber());
        response.setResumeUrl(entity.getResumeUrl());
        response.setStatus(entity.getStatus());
        response.setCreatedDate(entity.getCreatedDate());

        if (entity.getCreatedBy() != null) {
            response.setCreatedById(entity.getCreatedBy().getId());
            response.setCreatedByUsername(entity.getCreatedBy().getUsername());
        }

        return response;
    }
}