package com.appdev.interviewschedulermanagement.model;

import com.appdev.interviewschedulermanagement.enums.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "interview_participants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ParticipantRole role;

    private Boolean isRequired;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus attendanceStatus = AttendanceStatus.PENDING;

    // Jpa mappings
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("participants")
    private User user;

    // Inside InterviewParticipant.java
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    @JsonIgnoreProperties("participants") // Prevents infinite loops
    private Interview interview;
}