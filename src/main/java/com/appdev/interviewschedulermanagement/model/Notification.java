package com.appdev.interviewschedulermanagement.model;

import com.appdev.interviewschedulermanagement.enums.NotificationType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String message;
    
    @Enumerated(EnumType.STRING)
    private NotificationType type;
    
    private Boolean isRead = false;
    private LocalDateTime createdDate = LocalDateTime.now();
    private LocalDateTime sentDate = LocalDateTime.now();

    // Jpa mappings
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("notifications")
    private User user;
}