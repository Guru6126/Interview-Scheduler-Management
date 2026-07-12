package com.appdev.interviewschedulermanagement.mapper;

import com.appdev.interviewschedulermanagement.dto.InterviewRequest;
import com.appdev.interviewschedulermanagement.dto.InterviewResponse;
import com.appdev.interviewschedulermanagement.model.Candidate;
import com.appdev.interviewschedulermanagement.model.Interview;
import com.appdev.interviewschedulermanagement.model.JobPosition;
import org.springframework.stereotype.Component;

@Component
public class InterviewMapper {
    public Interview toEntity(InterviewRequest req, Candidate candidate, JobPosition jobPosition) {
        Interview i = new Interview();
        i.setCandidate(candidate);
        i.setJobPosition(jobPosition);
        i.setScheduledDate(req.getScheduledDate());
        i.setScheduledTime(req.getScheduledTime());
        i.setDuration(req.getDuration());
        i.setInterviewType(req.getInterviewType());
        i.setMeetingLink(req.getMeetingLink());
        i.setLocation(req.getLocation());
        i.setStatus(req.getStatus());
        i.setNotes(req.getNotes());
        return i;
    }

    public InterviewResponse toResponse(Interview e) {
        InterviewResponse r = new InterviewResponse();
        r.setId(e.getId());
        r.setCandidateId(e.getCandidate().getId());
        r.setCandidateName(e.getCandidate().getFirstName() + " " + e.getCandidate().getLastName());
        r.setJobPositionId(e.getJobPosition().getId());
        r.setJobPositionTitle(e.getJobPosition().getTitle());
        r.setScheduledDate(e.getScheduledDate());
        r.setScheduledTime(e.getScheduledTime());
        r.setDuration(e.getDuration());
        r.setInterviewType(e.getInterviewType());
        r.setMeetingLink(e.getMeetingLink());
        r.setLocation(e.getLocation());
        r.setStatus(e.getStatus());
        r.setNotes(e.getNotes());
        r.setCreatedDate(e.getCreatedDate());
        return r;
    }
}