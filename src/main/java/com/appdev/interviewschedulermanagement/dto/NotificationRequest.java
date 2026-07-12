package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.NotificationType;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificationRequest {
    @NotNull private Long userId;
    @NotNull private String title;
    @NotNull private String message;
    @NotNull private NotificationType type;
}