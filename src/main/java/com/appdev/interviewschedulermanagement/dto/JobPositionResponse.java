package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.JobPositionStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class JobPositionResponse {
    private Long id;
    private String title;
    private String description;
    private String department;
    private String location;
    private JobPositionStatus status;
    private Long createdById;
    private String createdByUsername;
    private LocalDateTime createdDate;
}