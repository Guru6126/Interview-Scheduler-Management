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
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // In production, encrypt this pass
        user.setPhoneNumber(request.getPhoneNumber());
        user.setEmployeeId(request.getEmployeeId());
        user.setDepartment(request.getDepartment());
        user.setRole(request.getRole());
        user.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        user.setTimezone(request.getTimezone());

        return user;
    }

    public UserResponse toResponse(User entity) {
        if (entity == null) {
            return null;
        }

        UserResponse response = new UserResponse();
        response.setId(entity.getId());
        response.setUsername(entity.getUsername());
        response.setFirstName(entity.getFirstName());
        response.setLastName(entity.getLastName());
        response.setEmail(entity.getEmail());
        response.setPhoneNumber(entity.getPhoneNumber());
        response.setEmployeeId(entity.getEmployeeId());
        response.setDepartment(entity.getDepartment());
        response.setRole(entity.getRole());
        response.setIsActive(entity.getIsActive());
        response.setTimezone(entity.getTimezone());
        response.setCreatedDate(entity.getCreatedDate());
        response.setLastLogin(entity.getLastLogin());

        return response;
    }
}