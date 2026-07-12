package com.appdev.interviewschedulermanagement.dto;

import java.time.LocalDateTime;

import com.appdev.interviewschedulermanagement.enums.NotificationType;

import lombok.Data;

@Data
public class NotificationResponse {
    private Long id;
    private Long userId;
    private String title;
    private String message;
    private NotificationType type;
    private Boolean isRead;
    private LocalDateTime createdDate;
}