package com.appdev.interviewschedulermanagement.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor; // Add this import

import com.appdev.interviewschedulermanagement.dto.AuditLogRequest;
import com.appdev.interviewschedulermanagement.dto.AuditLogResponse;
import com.appdev.interviewschedulermanagement.exception.ResourceNotFoundException;
import com.appdev.interviewschedulermanagement.mapper.AuditLogMapper;
import com.appdev.interviewschedulermanagement.model.AuditLog;
import com.appdev.interviewschedulermanagement.model.User;
import com.appdev.interviewschedulermanagement.repository.AuditLogRepository;
import com.appdev.interviewschedulermanagement.repository.UserRepository;

@Service
@RequiredArgsConstructor // This replaces your manual constructor entirely
@Transactional(readOnly = true) // This sets the default for all methods to read-only
public class AuditLogService {
    
    private final AuditLogRepository repo;
    private final AuditLogMapper mapper;
    private final UserRepository userRepo;

    // We keep @Transactional here because this method performs a SAVE (Write)
    @Transactional 
    public AuditLogResponse logAction(AuditLogRequest req) {
        System.out.println("DEBUG: The request object received is: " + req);
    System.out.println("DEBUG: The userId in the request is: " + req.getUserId());
        User user = userRepo.findById(req.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + req.getUserId()));
        
        AuditLog auditLog = mapper.toEntity(req, user);
        
        return mapper.toResponse(repo.save(auditLog));
    }

    public List<AuditLogResponse> getLogsByUser(Long userId) {
        return repo.findByUserId(userId).stream().map(mapper::toResponse).toList();
    }

    public List<AuditLogResponse> getLogsByEntity(String entityType, Long entityId) {
        return repo.findByEntityTypeAndEntityId(entityType, entityId).stream().map(mapper::toResponse).toList();
    }
}