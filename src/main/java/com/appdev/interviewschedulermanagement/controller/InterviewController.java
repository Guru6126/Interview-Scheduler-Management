package com.appdev.interviewschedulermanagement.controller;

import com.appdev.interviewschedulermanagement.dto.InterviewRequest;
import com.appdev.interviewschedulermanagement.dto.InterviewResponse;
import com.appdev.interviewschedulermanagement.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping
    public ResponseEntity<InterviewResponse> scheduleInterview(@Valid @RequestBody InterviewRequest request) {
        InterviewResponse response = interviewService.scheduleInterview(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewResponse> getInterviewById(@PathVariable Long id) {
        InterviewResponse response = interviewService.getInterviewById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/interviewer/{interviewerId}")
    public ResponseEntity<List<InterviewResponse>> getInterviewsByInterviewer(@PathVariable Long interviewerId) {
        List<InterviewResponse> response = interviewService.getInterviewsByInterviewer(interviewerId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<InterviewResponse>> getAllInterviews() {
        List<InterviewResponse> response = interviewService.getAllInterviews();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InterviewResponse> updateInterview(
            @PathVariable Long id, 
            @Valid @RequestBody InterviewRequest request) {
        InterviewResponse response = interviewService.updateInterview(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelInterview(@PathVariable Long id) {
        interviewService.cancelInterview(id);
        return ResponseEntity.noContent().build();
    }
}