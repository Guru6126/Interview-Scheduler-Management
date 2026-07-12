package com.appdev.interviewschedulermanagement.controller;

import com.appdev.interviewschedulermanagement.dto.AvailabilityRequest;
import com.appdev.interviewschedulermanagement.dto.AvailabilityResponse;
import com.appdev.interviewschedulermanagement.service.AvailabilityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/availabilities")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @PostMapping
    public ResponseEntity<AvailabilityResponse> createAvailability(@Valid @RequestBody AvailabilityRequest request) {
        AvailabilityResponse response = availabilityService.createAvailability(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AvailabilityResponse> getAvailabilityById(@PathVariable Long id) {
        AvailabilityResponse response = availabilityService.getAvailabilityById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/interviewer/{interviewerId}")
    public ResponseEntity<List<AvailabilityResponse>> getAvailabilityByInterviewer(@PathVariable Long interviewerId) {
        List<AvailabilityResponse> response = availabilityService.getAvailabilityByInterviewer(interviewerId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<AvailabilityResponse>> getAllAvailabilities() {
        List<AvailabilityResponse> response = availabilityService.getAllAvailabilities();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AvailabilityResponse> updateAvailability(
            @PathVariable Long id, 
            @Valid @RequestBody AvailabilityRequest request) {
        AvailabilityResponse response = availabilityService.updateAvailability(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable Long id) {
        availabilityService.deleteAvailability(id);
        return ResponseEntity.noContent().build();
    }
}