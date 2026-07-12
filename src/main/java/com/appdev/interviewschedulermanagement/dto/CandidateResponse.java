package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.CandidateStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CandidateResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String resumeUrl;
    private String currentPosition;
    private String currentCompany;
    private Integer experienceYears;
    private BigDecimal expectedSalary;
    private LocalDate availabilityDate;
    private CandidateStatus status;
    private String source;
    private Long recruiterId;
    private String recruiterName;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}