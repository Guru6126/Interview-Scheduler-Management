package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.config.JwtService;
import com.appdev.interviewschedulermanagement.dto.AuthRequest;
import com.appdev.interviewschedulermanagement.dto.AuthenticationResponse;
import com.appdev.interviewschedulermanagement.dto.RegisterRequest;
import com.appdev.interviewschedulermanagement.enums.UserRole;
import com.appdev.interviewschedulermanagement.model.User;
import com.appdev.interviewschedulermanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
    // Convert the incoming String to your UserRole Enum
    UserRole userRole;
    try {
        userRole = UserRole.valueOf(request.getRole().toUpperCase());
    } catch (IllegalArgumentException | NullPointerException e) {
        // Fallback or default role if none provided or invalid
        userRole = UserRole.RECRUITER; 
    }

    var user = User.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .username(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(userRole) // Using the dynamic role
            .isActive(true)
            .build();
            
    repository.save(user);
    
    var jwtToken = jwtService.generateToken(user);
    return AuthenticationResponse.builder().token(jwtToken).build();
}

    public AuthenticationResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        var user = repository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }
}