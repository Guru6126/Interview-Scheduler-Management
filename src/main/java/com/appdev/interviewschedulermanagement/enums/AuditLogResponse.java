package com.appdev.interviewschedulermanagement.enums;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AuditLogResponse {
    private Long id;
    private Long userId;
    private String action;
    private String entityType;
    private Long entityId;
    private String details;
    private LocalDateTime timestamp;
}