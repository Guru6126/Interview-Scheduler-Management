package com.appdev.interviewschedulermanagement.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.appdev.interviewschedulermanagement.enums.AuditLogRequest;
import com.appdev.interviewschedulermanagement.enums.AuditLogResponse;
import com.appdev.interviewschedulermanagement.mapper.AuditLogMapper;
import com.appdev.interviewschedulermanagement.repository.AuditLogRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogService {
    private final AuditLogRepository repo;
    private final AuditLogMapper mapper;

    public AuditLogService(AuditLogRepository repo, AuditLogMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    @Transactional
    public AuditLogResponse logAction(AuditLogRequest req) {
        return mapper.toResponse(repo.save(mapper.toEntity(req)));
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> getLogsByUser(Long userId) {
        return repo.findByUserId(userId).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> getLogsByEntity(String entityType, Long entityId) {
        return repo.findByEntityTypeAndEntityId(entityType, entityId).stream().map(mapper::toResponse).toList();
    }
}