package com.appdev.interviewschedulermanagement.controller;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.enums.JobApplicationStatus;
import com.appdev.interviewschedulermanagement.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/job-applications")
public class JobApplicationController {
    private final JobApplicationService service;
    public JobApplicationController(JobApplicationService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<JobApplicationResponse> applyToJob(@Valid @RequestBody JobApplicationRequest req) {
        return ResponseEntity.ok(service.applyToJob(req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> getApplication(@PathVariable Long id) {
        return ResponseEntity.ok(service.getApplicationById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<JobApplicationResponse> updateApplicationStatus(@PathVariable Long id, @RequestParam JobApplicationStatus status) {
        return ResponseEntity.ok(service.updateApplicationStatus(id, status));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobApplicationResponse>> getApplicationsByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(service.getApplicationsByJob(jobId));
    }
}