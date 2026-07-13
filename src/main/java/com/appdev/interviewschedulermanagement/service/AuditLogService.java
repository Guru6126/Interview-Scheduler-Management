package com.appdev.interviewschedulermanagement.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.appdev.interviewschedulermanagement.enums.AuditLogRequest;
import com.appdev.interviewschedulermanagement.enums.AuditLogResponse;
import com.appdev.interviewschedulermanagement.mapper.AuditLogMapper;
import com.appdev.interviewschedulermanagement.model.AuditLog;
import com.appdev.interviewschedulermanagement.model.User;
import com.appdev.interviewschedulermanagement.repository.AuditLogRepository;
import com.appdev.interviewschedulermanagement.repository.UserRepository;

import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogService {
    private final AuditLogRepository repo;
    private final AuditLogMapper mapper;
    private final UserRepository userRepo;

    public AuditLogService(AuditLogRepository repo, AuditLogMapper mapper, UserRepository userRepo) {
        this.repo = repo;
        this.mapper = mapper;
        this.userRepo = userRepo;
    }

    @Transactional
    public AuditLogResponse logAction(AuditLogRequest req) {
        // 1. Fetch the user entity from the database
        User user = userRepo.findById(req.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found with id: " + req.getUserId()));
        
        // 2. Pass the user object to the mapper
        AuditLog auditLog = mapper.toEntity(req, user);
        
        // 3. Save and return response
        return mapper.toResponse(repo.save(auditLog));
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