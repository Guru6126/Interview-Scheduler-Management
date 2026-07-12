package com.appdev.interviewschedulermanagement.mapper;

import com.appdev.interviewschedulermanagement.dto.CandidateRequest;
import com.appdev.interviewschedulermanagement.dto.CandidateResponse;
import com.appdev.interviewschedulermanagement.model.Candidate;
import com.appdev.interviewschedulermanagement.model.User;
import org.springframework.stereotype.Component;

@Component
public class CandidateMapper {

    public Candidate toEntity(CandidateRequest request, User recruiter) {
        if (request == null) {
            return null;
        }

        Candidate candidate = new Candidate();
        candidate.setFirstName(request.getFirstName());
        candidate.setLastName(request.getLastName());
        candidate.setEmail(request.getEmail());
        candidate.setPhoneNumber(request.getPhoneNumber());
        candidate.setResumeUrl(request.getResumeUrl());
        candidate.setCurrentPosition(request.getCurrentPosition());
        candidate.setCurrentCompany(request.getCurrentCompany());
        candidate.setExperienceYears(request.getExperienceYears());
        candidate.setExpectedSalary(request.getExpectedSalary());
        candidate.setAvailabilityDate(request.getAvailabilityDate());
        candidate.setStatus(request.getStatus());
        candidate.setSource(request.getSource());
        candidate.setRecruiter(recruiter);

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
        response.setCurrentPosition(entity.getCurrentPosition());
        response.setCurrentCompany(entity.getCurrentCompany());
        response.setExperienceYears(entity.getExperienceYears());
        response.setExpectedSalary(entity.getExpectedSalary());
        response.setAvailabilityDate(entity.getAvailabilityDate());
        response.setStatus(entity.getStatus());
        response.setSource(entity.getSource());
        response.setCreatedDate(entity.getCreatedDate());
        response.setUpdatedDate(entity.getUpdatedDate());

        if (entity.getRecruiter() != null) {
            response.setRecruiterId(entity.getRecruiter().getId());
            response.setRecruiterName(entity.getRecruiter().getFirstName() + " " + entity.getRecruiter().getLastName());
        }

        return response;
    }
}