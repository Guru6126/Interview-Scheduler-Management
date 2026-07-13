package com.appdev.interviewschedulermanagement.model;

import com.appdev.interviewschedulermanagement.enums.InterviewStatus;
import com.appdev.interviewschedulermanagement.enums.InterviewType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_position_id")
    @JsonIgnoreProperties("interviews")
    private JobPosition jobPosition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id")
    @JsonIgnoreProperties("interviews")
    private Candidate candidate;
}