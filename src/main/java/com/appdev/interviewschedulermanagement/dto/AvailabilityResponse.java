package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.AvailabilityStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AvailabilityResponse {
    private Long id;
    private Long interviewerId;
    private String interviewerUsername;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private AvailabilityStatus status;
    private LocalDateTime createdDate;
}