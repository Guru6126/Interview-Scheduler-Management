package com.appdev.interviewschedulermanagement.model;

import com.appdev.interviewschedulermanagement.enums.*;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    private Interview interview;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private ParticipantRole role;

    private Boolean isRequired;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus attendanceStatus = AttendanceStatus.PENDING;
}