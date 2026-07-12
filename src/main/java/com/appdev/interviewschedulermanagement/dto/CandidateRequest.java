package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.CandidateStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

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

    @Size(max = 15, message = "Phone number cannot exceed 15 characters")
    private String phoneNumber;

    @Size(max = 255, message = "Resume URL cannot exceed 255 characters")
    private String resumeUrl;

    @NotNull(message = "Candidate status is required")
    private CandidateStatus status;

    @NotNull(message = "Creator User ID is required")
    private Long createdById;
}