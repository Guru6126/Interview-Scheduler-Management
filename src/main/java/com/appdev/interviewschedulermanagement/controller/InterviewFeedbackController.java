package com.appdev.interviewschedulermanagement.controller;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.service.InterviewFeedbackService;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
public class InterviewFeedbackController {
    private final InterviewFeedbackService service;
    public InterviewFeedbackController(InterviewFeedbackService service) { this.service = service; }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERVIEWER')") // Interviewers submit ratings & comments[cite: 1]
    public ResponseEntity<InterviewFeedbackResponse> submitFeedback(@Valid @RequestBody InterviewFeedbackRequest req) {
        return ResponseEntity.ok(service.submitFeedback(req));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER', 'COORDINATOR', 'INTERVIEWER')")
    public ResponseEntity<InterviewFeedbackResponse> getFeedback(@PathVariable Long id) {
        return ResponseEntity.ok(service.getFeedbackById(id));
    }

    @GetMapping("/interview/{interviewId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER', 'COORDINATOR', 'INTERVIEWER')") // Review scorecards & track pending feedback[cite: 1]
    public ResponseEntity<InterviewFeedbackResponse> getFeedbackByInterview(@PathVariable Long interviewId) {
        return ResponseEntity.ok(service.getFeedbackByInterview(interviewId));
    }

    @GetMapping("/interviewer/{interviewerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER', 'COORDINATOR', 'INTERVIEWER')")
    public ResponseEntity<List<InterviewFeedbackResponse>> getFeedbackByInterviewer(@PathVariable Long interviewerId) {
        return ResponseEntity.ok(service.getFeedbackByInterviewer(interviewerId));
    }
}