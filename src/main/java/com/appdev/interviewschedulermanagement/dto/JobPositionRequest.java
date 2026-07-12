package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.EmploymentType;
import com.appdev.interviewschedulermanagement.enums.JobPositionStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class JobPositionRequest {
    @NotNull(message = "Creator ID is required")
    private Long creatorId;
    @NotBlank(message = "Title is required")
    private String title;
    private String description;
    @NotBlank(message = "Department is required")
    private String department;
    private String location;
    @NotNull(message = "Employment type is required")
    private EmploymentType employmentType;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String requirements;
    private String responsibilities;
    @NotNull(message = "Status is required")
    private JobPositionStatus status;
}