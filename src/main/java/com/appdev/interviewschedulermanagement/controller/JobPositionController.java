package com.appdev.interviewschedulermanagement.controller;

import com.appdev.interviewschedulermanagement.dto.JobPositionRequest;
import com.appdev.interviewschedulermanagement.dto.JobPositionResponse;
import com.appdev.interviewschedulermanagement.enums.JobPositionStatus;
import com.appdev.interviewschedulermanagement.service.JobPositionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobPositionController {

    private final JobPositionService jobPositionService;

    public JobPositionController(JobPositionService jobPositionService) {
        this.jobPositionService = jobPositionService;
    }

    @PostMapping
    public ResponseEntity<JobPositionResponse> createJobPosition(@Valid @RequestBody JobPositionRequest request) {
        JobPositionResponse response = jobPositionService.createJobPosition(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobPositionResponse> getJobPositionById(@PathVariable Long id) {
        JobPositionResponse response = jobPositionService.getJobPositionById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<JobPositionResponse>> getAllJobPositions() {
        List<JobPositionResponse> response = jobPositionService.getAllJobPositions();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<JobPositionResponse>> getJobPositionsByStatus(@PathVariable JobPositionStatus status) {
        List<JobPositionResponse> response = jobPositionService.getJobPositionsByStatus(status);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobPositionResponse> updateJobPosition(
            @PathVariable Long id, 
            @Valid @RequestBody JobPositionRequest request) {
        JobPositionResponse response = jobPositionService.updateJobPosition(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobPosition(@PathVariable Long id) {
        jobPositionService.deleteJobPosition(id);
        return ResponseEntity.noContent().build();
    }
}