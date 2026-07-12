package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.CandidateStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CandidateResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String resumeUrl;
    private CandidateStatus status;
    private Long createdById;
    private String createdByUsername;
    private LocalDateTime createdDate;
}