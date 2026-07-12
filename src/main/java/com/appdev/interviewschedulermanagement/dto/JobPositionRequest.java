package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.JobPositionStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class JobPositionRequest {

    @NotBlank(message = "Job title is required")
    @Size(max = 100, message = "Job title cannot exceed 100 characters")
    private String title;

    private String description;

    @NotBlank(message = "Department is required")
    @Size(max = 50, message = "Department name cannot exceed 50 characters")
    private String department;

    @Size(max = 100, message = "Location cannot exceed 100 characters")
    private String location;

    @NotNull(message = "Job status is required")
    private JobPositionStatus status;

    @NotNull(message = "Creator User ID is required")
    private Long createdById;
}