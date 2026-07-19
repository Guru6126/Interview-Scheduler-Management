package com.appdev.interviewschedulermanagement.controller;

import com.appdev.interviewschedulermanagement.dto.AuthRequest;
import com.appdev.interviewschedulermanagement.dto.AuthenticationResponse;
import com.appdev.interviewschedulermanagement.dto.RegisterRequest;
import com.appdev.interviewschedulermanagement.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
}