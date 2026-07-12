package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.JobApplicationStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class JobApplicationResponse {
    private Long id;
    private Long candidateId;
    private String candidateName;
    private Long jobPositionId;
    private String jobPositionTitle;
    private LocalDateTime appliedDate;
    private JobApplicationStatus status;
}