package com.appdev.interviewschedulermanagement.mapper;

import com.appdev.interviewschedulermanagement.dto.UserRequest;
import com.appdev.interviewschedulermanagement.dto.UserResponse;
import com.appdev.interviewschedulermanagement.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserRequest request) {
        if (request == null) {
            return null;
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        // Note: Password hashing will be implemented in the Security phase later.
        // For now, we store the raw password string directly into the passwordHash field.
        user.setPasswordHash(request.getPassword());
        user.setRole(request.getRole());
        user.setEmployeeId(request.getEmployeeId());
        user.setDepartment(request.getDepartment());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        
        if (request.getTimezone() != null) {
            user.setTimezone(request.getTimezone());
        }

        return user;
    }

    public UserResponse toResponse(User entity) {
        if (entity == null) {
            return null;
        }

        UserResponse response = new UserResponse();
        response.setId(entity.getId());
        response.setUsername(entity.getUsername());
        response.setEmail(entity.getEmail());
        response.setRole(entity.getRole());
        response.setEmployeeId(entity.getEmployeeId());
        response.setDepartment(entity.getDepartment());
        response.setFirstName(entity.getFirstName());
        response.setLastName(entity.getLastName());
        response.setPhoneNumber(entity.getPhoneNumber());
        response.setCreatedDate(entity.getCreatedDate());
        response.setLastLogin(entity.getLastLogin());
        response.setIsActive(entity.getIsActive());
        response.setTimezone(entity.getTimezone());

        return response;
    }
}