package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.UserRequest;
import com.appdev.interviewschedulermanagement.dto.UserResponse;
import com.appdev.interviewschedulermanagement.enums.UserRole; // Make sure this is imported
import com.appdev.interviewschedulermanagement.model.User;
import com.appdev.interviewschedulermanagement.mapper.UserMapper;
import com.appdev.interviewschedulermanagement.repository.UserRepository;
import com.appdev.interviewschedulermanagement.exception.ResourceNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder; // 1. Import PasswordEncoder
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService implements UserDetailsService { 

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder; // 1. Inject PasswordEncoder

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @Transactional 
    public UserResponse createUser(UserRequest request) {
        checkNotCoordinator();
        // Unique checks
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already taken");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email address is already registered");
        }
        if (request.getEmployeeId() != null && userRepository.findByEmployeeId(request.getEmployeeId()).isPresent()) {
            throw new RuntimeException("Employee ID is already assigned");
        }

        // Check if requested role is ADMIN and enforce the max limit of 3
        if (request.getRole() == UserRole.ADMIN) {
            long currentAdminCount = userRepository.countByRole(UserRole.ADMIN);
            if (currentAdminCount >= 3) {
                throw new RuntimeException("Security Error: Maximum limit of 3 administrators has already been reached!");
            }
        }

        User user = userMapper.toEntity(request);
        
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userMapper.toResponse(userRepository.save(user));
    }

    public UserResponse getUserById(Long id) {
        checkNotCoordinator();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return userMapper.toResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        checkNotCoordinator();
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @Transactional 
    public UserResponse updateUser(Long id, UserRequest request) {
        checkNotCoordinator();
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        existingUser.setFirstName(request.getFirstName());
        existingUser.setLastName(request.getLastName());
        existingUser.setPhoneNumber(request.getPhoneNumber());
        existingUser.setDepartment(request.getDepartment());
        existingUser.setRole(request.getRole());
        existingUser.setIsActive(request.getIsActive());
        existingUser.setTimezone(request.getTimezone());

        return userMapper.toResponse(userRepository.save(existingUser));
    }

    @Transactional 
    public void updateLastLogin(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
    }

    @Transactional 
    public void deleteUser(Long id) {
        checkNotCoordinator();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        if ("admin@interviewsched.com".equalsIgnoreCase(user.getEmail())) {
            throw new RuntimeException("Action prohibited: Cannot delete the Master Admin account!");
        }
        userRepository.delete(user);
    }

    private void checkNotCoordinator() {
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User currentUser = (User) authentication.getPrincipal();
            if (currentUser.getRole() == UserRole.COORDINATOR) {
                throw new AccessDeniedException("Access Denied: Coordinators have no access to user management.");
            }
        }
    }
}