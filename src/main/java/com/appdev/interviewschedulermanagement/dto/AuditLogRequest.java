package com.appdev.interviewschedulermanagement.dto;

import lombok.Data;

@Data
public class AuditLogRequest {
    private Long userId;
    private String action;
    private String entityType;
    private Long entityId;
    private String details;
    private String ipAddress;
    private String userAgent;
}