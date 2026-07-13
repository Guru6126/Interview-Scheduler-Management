package com.appdev.interviewschedulermanagement.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String action;
    private String entityType;
    private Long entityId;
    @Column(columnDefinition = "TEXT")
    private String details;
    private String ipAddress;
    private String userAgent;
    private LocalDateTime timestamp = LocalDateTime.now();

    // Jpa mappings
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("auditLogs")
    private User user;
}