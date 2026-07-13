package com.appdev.interviewschedulermanagement.model;

import com.appdev.interviewschedulermanagement.enums.JobApplicationStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime appliedDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private JobApplicationStatus status = JobApplicationStatus.APPLIED;

    //Jpa mappings
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id")
    @JsonIgnoreProperties("jobApplications")
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_position_id")
    @JsonIgnoreProperties("jobApplications")
    private JobPosition jobPosition;
}