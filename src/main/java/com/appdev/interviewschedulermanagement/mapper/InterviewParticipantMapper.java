package com.appdev.interviewschedulermanagement.mapper;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.model.*;
import org.springframework.stereotype.Component;

@Component
public class InterviewParticipantMapper {
    public InterviewParticipant toEntity(InterviewParticipantRequest req, Interview i, User u) {
        InterviewParticipant p = new InterviewParticipant();
        p.setInterview(i);
        p.setUser(u);
        p.setRole(req.getRole());
        p.setIsRequired(req.getIsRequired());
        return p;
    }

    public InterviewParticipantResponse toResponse(InterviewParticipant p) {
        InterviewParticipantResponse r = new InterviewParticipantResponse();
        r.setId(p.getId());
        r.setInterviewId(p.getInterview().getId());
        r.setUserId(p.getUser().getId());
        r.setUserName(p.getUser().getFirstName() + " " + p.getUser().getLastName());
        r.setRole(p.getRole());
        r.setIsRequired(p.getIsRequired());
        r.setAttendanceStatus(p.getAttendanceStatus());
        return r;
    }
}