package com.appdev.interviewschedulermanagement.model;

import com.appdev.interviewschedulermanagement.enums.CandidateStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "candidates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "resume_url", length = 255)
    private String resumeUrl;

    @Column(name = "current_position", length = 100)
    private String currentPosition;

    @Column(name = "current_company", length = 100)
    private String currentCompany;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "expected_salary", precision = 12, scale = 2)
    private BigDecimal expectedSalary;

    @Column(name = "availability_date")
    private LocalDate availabilityDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CandidateStatus status = CandidateStatus.APPLIED;

    @Column(length = 100)
    private String source;

    @Column(name = "created_date", updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }

    // Jpa mappings

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id")
    @JsonIgnoreProperties("candidates")
    private User recruiter;

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("candidate")
    private List<JobApplication> jobApplications = new ArrayList<>();
}