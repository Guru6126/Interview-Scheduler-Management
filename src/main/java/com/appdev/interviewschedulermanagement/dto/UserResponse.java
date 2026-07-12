package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.Role;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private Role role;
    private String employeeId;
    private String department;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private LocalDateTime createdDate;
    private LocalDateTime lastLogin;
    private Boolean isActive;
    private String timezone;
}