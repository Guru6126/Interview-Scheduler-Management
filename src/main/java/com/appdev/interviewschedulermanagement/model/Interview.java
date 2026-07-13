package com.appdev.interviewschedulermanagement.model;

import com.appdev.interviewschedulermanagement.enums.InterviewStatus;
import com.appdev.interviewschedulermanagement.enums.InterviewType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.*;

@Entity
@Table(name = "interviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Interview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate scheduledDate;
    private LocalTime scheduledTime;
    private Integer duration; // in minutes

    @Enumerated(EnumType.STRING)
    private InterviewType interviewType;

    private String meetingLink;
    private String location;

    @Enumerated(EnumType.STRING)
    private InterviewStatus status = InterviewStatus.SCHEDULED;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime createdDate = LocalDateTime.now();
    private LocalDateTime updatedDate;

    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }

    //JPA Relationships

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_position_id")
    @JsonIgnoreProperties("interviews")
    private JobPosition jobPosition;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    @JsonIgnoreProperties("interviews") // Prevents infinite recursion
    private Candidate candidate;

    // 1. One-to-Many: An interview can have multiple participants
    @OneToMany(mappedBy = "interview", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("interview")
    private List<InterviewParticipant> participants = new ArrayList<>();

    // 2. One-to-One (or One-to-Many): An interview gets feedback
    @OneToOne(mappedBy = "interview", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("interview")
    private InterviewFeedback feedback;
}