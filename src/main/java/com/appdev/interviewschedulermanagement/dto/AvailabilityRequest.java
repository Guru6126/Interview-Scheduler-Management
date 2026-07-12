package com.appdev.interviewschedulermanagement.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AvailabilityRequest {
    @NotNull private Long userId;
    @NotNull private LocalDate availableDate;
    @NotNull private LocalTime startTime;
    @NotNull private LocalTime endTime;
    private Boolean isAvailable = true;
    private Boolean recurring = false;
}