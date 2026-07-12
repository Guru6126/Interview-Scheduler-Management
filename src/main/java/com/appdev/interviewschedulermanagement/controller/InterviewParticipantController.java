package com.appdev.interviewschedulermanagement.controller;

import com.appdev.interviewschedulermanagement.dto.InterviewParticipantRequest;
import com.appdev.interviewschedulermanagement.dto.InterviewParticipantResponse;
import com.appdev.interviewschedulermanagement.enums.AttendanceStatus;
import com.appdev.interviewschedulermanagement.service.InterviewParticipantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<InterviewParticipantResponse> addParticipant(@Valid @RequestBody InterviewParticipantRequest req) {
        return ResponseEntity.ok(service.addParticipant(req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeParticipant(@PathVariable Long id) {
        service.removeParticipant(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{interviewId}/user/{userId}/attendance")
    public ResponseEntity<InterviewParticipantResponse> updateAttendance(
            @PathVariable Long interviewId, 
            @PathVariable Long userId, 
            @RequestParam AttendanceStatus status) {
        return ResponseEntity.ok(service.updateAttendance(interviewId, userId, status));
    }

    @GetMapping("/interview/{interviewId}")
    public ResponseEntity<List<InterviewParticipantResponse>> getParticipants(@PathVariable Long interviewId) {
        return ResponseEntity.ok(service.getParticipantsByInterview(interviewId));
    }
}