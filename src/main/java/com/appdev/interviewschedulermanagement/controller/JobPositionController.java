package com.appdev.interviewschedulermanagement.controller;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.service.JobPositionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobPositionController {
    private final JobPositionService jobService;

    public JobPositionController(JobPositionService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<JobPositionResponse> create(@Valid @RequestBody JobPositionRequest req) {
        return ResponseEntity.ok(jobService.createJob(req));
    }

    @GetMapping
    public ResponseEntity<List<JobPositionResponse>> getAll() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobPositionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
}