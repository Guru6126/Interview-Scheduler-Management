package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.InterviewStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class InterviewResponse {
    private Long id;
    
    private Long candidateId;
    private String candidateName;
    
    private Long jobPositionId;
    private String jobPositionTitle;
    
    private Long interviewerId;
    private String interviewerName;
    
    private Long organizedById;
    private String organizedByName;
    
    private LocalDateTime scheduledTime;
    private InterviewStatus status;
    private String meetingLink;
    private LocalDateTime createdDate;
}