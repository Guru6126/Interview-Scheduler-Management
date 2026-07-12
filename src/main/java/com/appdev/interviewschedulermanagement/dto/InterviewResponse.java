package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.InterviewStatus;
import com.appdev.interviewschedulermanagement.enums.InterviewType;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class InterviewResponse {
    private Long id;
    private Long candidateId;
    private String candidateName;
    private Long jobPositionId;
    private String jobPositionTitle;
    private LocalDate scheduledDate;
    private LocalTime scheduledTime;
    private Integer duration;
    private InterviewType interviewType;
    private String meetingLink;
    private String location;
    private InterviewStatus status;
    private String notes;
    private LocalDateTime createdDate;
}