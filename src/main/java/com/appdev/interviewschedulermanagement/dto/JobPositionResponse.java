package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.EmploymentType;
import com.appdev.interviewschedulermanagement.enums.JobPositionStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class JobPositionResponse {
    private Long id;
    private Long creatorId;
    private String creatorName;
    private String title;
    private String description;
    private String department;
    private String location;
    private EmploymentType employmentType;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String requirements;
    private String responsibilities;
    private JobPositionStatus status;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}