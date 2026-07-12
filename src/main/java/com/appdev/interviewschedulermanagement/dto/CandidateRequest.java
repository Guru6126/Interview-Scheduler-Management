package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.CandidateStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CandidateRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name cannot exceed 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name cannot exceed 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    private String phoneNumber;

    @Size(max = 255, message = "Resume URL cannot exceed 255 characters")
    private String resumeUrl;

    @Size(max = 100, message = "Current position cannot exceed 100 characters")
    private String currentPosition;

    @Size(max = 100, message = "Current company cannot exceed 100 characters")
    private String currentCompany;

    private Integer experienceYears;

    private BigDecimal expectedSalary;

    private LocalDate availabilityDate;

    @NotNull(message = "Candidate status is required")
    private CandidateStatus status;

    @Size(max = 100, message = "Source cannot exceed 100 characters")
    private String source;

    private Long recruiterId;
}