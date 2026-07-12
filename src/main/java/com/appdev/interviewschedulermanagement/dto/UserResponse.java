package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.UserRole;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String employeeId;
    private String department;
    private UserRole role;
    private Boolean isActive;
    private String timezone;
    private LocalDateTime createdDate;
    private LocalDateTime lastLogin;
}