package com.appdev.interviewschedulermanagement.controller;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.service.InterviewService;
import jakarta.validation.Valid;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {
    private final InterviewService service;
    public InterviewController(InterviewService service) { this.service = service; }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER', 'COORDINATOR')") // Full scheduling access
    public ResponseEntity<InterviewResponse> scheduleInterview(@Valid @RequestBody InterviewRequest req) {
        return ResponseEntity.ok(service.scheduleInterview(req));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER', 'COORDINATOR', 'INTERVIEWER')") // Read access across roles
    public ResponseEntity<InterviewResponse> getInterview(@PathVariable Long id) {
        return ResponseEntity.ok(service.getInterviewById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER', 'COORDINATOR')") // Update/Manage slots
    public ResponseEntity<InterviewResponse> updateInterview(@PathVariable Long id, @Valid @RequestBody InterviewRequest req) {
        return ResponseEntity.ok(service.updateInterviewDetails(id, req));
    }

    @DeleteMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER', 'COORDINATOR')") // Cancel slots
    public ResponseEntity<Void> cancelInterview(@PathVariable Long id) {
        service.cancelInterview(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER', 'COORDINATOR', 'INTERVIEWER')") // Track pipeline/view assigned slots
    public ResponseEntity<List<InterviewResponse>> getAllInterviews() {
        return ResponseEntity.ok(service.getAllInterviews());
    }

    @PatchMapping("/{id}/reschedule")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER', 'COORDINATOR')") // Reschedule slots
    public ResponseEntity<InterviewResponse> rescheduleInterview(
            @PathVariable Long id, 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date, 
            @RequestParam String time) {
        LocalTime parsedTime = LocalTime.parse(time.length() > 8 ? time.substring(11, 19) : time);
        return ResponseEntity.ok(service.rescheduleInterview(id, date, parsedTime));
    }
}