package com.appdev.interviewschedulermanagement.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.security.access.prepost.PreAuthorize;
import com.appdev.interviewschedulermanagement.dto.AuditLogRequest;
import com.appdev.interviewschedulermanagement.dto.AuditLogResponse;
import com.appdev.interviewschedulermanagement.service.AuditLogService;


@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {
    private final AuditLogService service;

    public AuditLogController(AuditLogService service) { this.service = service; }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLogResponse>> getAllLogs() {
        return ResponseEntity.ok(service.getAllLogs());
    }

    @PostMapping
    public ResponseEntity<AuditLogResponse> logAction(@RequestBody AuditLogRequest req) {
        return ResponseEntity.ok(service.logAction(req));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AuditLogResponse>> getLogsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getLogsByUser(userId));
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<List<AuditLogResponse>> getLogsByEntity(@PathVariable String entityType, @PathVariable Long entityId) {
        return ResponseEntity.ok(service.getLogsByEntity(entityType, entityId));
    }
}
