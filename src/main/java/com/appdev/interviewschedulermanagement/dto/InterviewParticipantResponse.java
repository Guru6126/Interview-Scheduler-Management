package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.*;
import lombok.Data;

@Data
public class InterviewParticipantResponse {
    private Long id;
    private Long interviewId;
    private Long userId;
    private String userName;
    private ParticipantRole role;
    private Boolean isRequired;
    private AttendanceStatus attendanceStatus;
}