package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.JobApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JobApplicationRequest {
    @NotNull private Long candidateId;
    @NotNull private Long jobPositionId;
    private JobApplicationStatus status;
}