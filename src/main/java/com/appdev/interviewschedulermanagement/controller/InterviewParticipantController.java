package com.appdev.interviewschedulermanagement.controller;

import com.appdev.interviewschedulermanagement.dto.InterviewParticipantRequest;
import com.appdev.interviewschedulermanagement.dto.InterviewParticipantResponse;
import com.appdev.interviewschedulermanagement.enums.AttendanceStatus;
import com.appdev.interviewschedulermanagement.service.InterviewParticipantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/participants")
public class InterviewParticipantController {
    private final InterviewParticipantService service;

    public InterviewParticipantController(InterviewParticipantService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')") // Assign interviewers to sessions[cite: 1]
    public ResponseEntity<InterviewParticipantResponse> addParticipant(@Valid @RequestBody InterviewParticipantRequest req) {
        return ResponseEntity.ok(service.addParticipant(req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    public ResponseEntity<Void> removeParticipant(@PathVariable Long id) {
        service.removeParticipant(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{interviewId}/user/{userId}/attendance")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'INTERVIEWER')") // Manage or update status
    public ResponseEntity<InterviewParticipantResponse> updateAttendance(
            @PathVariable Long interviewId, 
            @PathVariable Long userId, 
            @RequestParam AttendanceStatus status) {
        return ResponseEntity.ok(service.updateAttendance(interviewId, userId, status));
    }

    @GetMapping("/interview/{interviewId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER', 'COORDINATOR', 'INTERVIEWER')") // Read-only / view co-panelists[cite: 1]
    public ResponseEntity<List<InterviewParticipantResponse>> getParticipants(@PathVariable Long interviewId) {
        return ResponseEntity.ok(service.getParticipantsByInterview(interviewId));
    }
}