package com.appdev.interviewschedulermanagement.mapper;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.appdev.interviewschedulermanagement.enums.AuditLogRequest;
import com.appdev.interviewschedulermanagement.enums.AuditLogResponse;
import com.appdev.interviewschedulermanagement.model.AuditLog;

@Component
public class AuditLogMapper {
    public AuditLog toEntity(AuditLogRequest req) {
        return new AuditLog(null, req.getUserId(), req.getAction(), req.getEntityType(), 
                            req.getEntityId(), req.getDetails(), req.getIpAddress(), 
                            req.getUserAgent(), LocalDateTime.now());
    }

    public AuditLogResponse toResponse(AuditLog a) {
        AuditLogResponse r = new AuditLogResponse();
        r.setId(a.getId());
        r.setUserId(a.getUserId());
        r.setAction(a.getAction());
        r.setEntityType(a.getEntityType());
        r.setEntityId(a.getEntityId());
        r.setDetails(a.getDetails());
        r.setTimestamp(a.getTimestamp());
        return r;
    }
}