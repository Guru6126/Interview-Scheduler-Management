package com.appdev.interviewschedulermanagement.mapper;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.appdev.interviewschedulermanagement.dto.AuditLogRequest;
import com.appdev.interviewschedulermanagement.dto.AuditLogResponse;
import com.appdev.interviewschedulermanagement.model.AuditLog;
import com.appdev.interviewschedulermanagement.model.User;

@Component
public class AuditLogMapper {
    public AuditLog toEntity(AuditLogRequest req, User user) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUser(user); // Set the actual User object here
        auditLog.setAction(req.getAction());
        auditLog.setEntityType(req.getEntityType());
        auditLog.setEntityId(req.getEntityId());
        auditLog.setDetails(req.getDetails());
        auditLog.setIpAddress(req.getIpAddress());
        auditLog.setUserAgent(req.getUserAgent());
        auditLog.setTimestamp(LocalDateTime.now());
        return auditLog;
    }

    public AuditLogResponse toResponse(AuditLog a) {
        AuditLogResponse r = new AuditLogResponse();
        r.setId(a.getId());
        if (a.getUser() != null) {
            r.setUserId(a.getUser().getId());
        }
        r.setAction(a.getAction());
        r.setEntityType(a.getEntityType());
        r.setEntityId(a.getEntityId());
        r.setDetails(a.getDetails());
        r.setTimestamp(a.getTimestamp());
        return r;
    }
}