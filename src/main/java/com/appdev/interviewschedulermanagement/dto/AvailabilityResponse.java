package com.appdev.interviewschedulermanagement.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AvailabilityResponse {
    private Long id;
    private Long userId;
    private String userName;
    private LocalDate availableDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isAvailable;
    private Boolean recurring;
}