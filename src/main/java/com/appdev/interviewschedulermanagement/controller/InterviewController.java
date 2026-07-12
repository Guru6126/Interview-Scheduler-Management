package com.appdev.interviewschedulermanagement.controller;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {
    private final InterviewService service;
    public InterviewController(InterviewService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<InterviewResponse> scheduleInterview(@Valid @RequestBody InterviewRequest req) {
        return ResponseEntity.ok(service.scheduleInterview(req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewResponse> getInterview(@PathVariable Long id) {
        return ResponseEntity.ok(service.getInterviewById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InterviewResponse> updateInterview(@PathVariable Long id, @Valid @RequestBody InterviewRequest req) {
        return ResponseEntity.ok(service.updateInterviewDetails(id, req));
    }

    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelInterview(@PathVariable Long id) {
        service.cancelInterview(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/reschedule")
    public ResponseEntity<InterviewResponse> rescheduleInterview(
            @PathVariable Long id, 
            @RequestParam LocalDate date, 
            @RequestParam LocalTime time) {
        return ResponseEntity.ok(service.rescheduleInterview(id, date, time));
    }
}