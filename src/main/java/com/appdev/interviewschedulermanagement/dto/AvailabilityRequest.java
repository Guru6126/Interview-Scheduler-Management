package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.AvailabilityStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AvailabilityRequest {

    @NotNull(message = "Interviewer User ID is required")
    private Long interviewerId;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    @NotNull(message = "Availability status is required")
    private AvailabilityStatus status;
}