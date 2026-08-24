package com.appdev.interviewschedulermanagement.controller;

import com.appdev.interviewschedulermanagement.dto.CandidateRequest;
import com.appdev.interviewschedulermanagement.dto.CandidateResponse;
import com.appdev.interviewschedulermanagement.service.CandidateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
    public ResponseEntity<CandidateResponse> createCandidate(@Valid @RequestBody CandidateRequest request) {
        CandidateResponse response = candidateService.createCandidate(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER', 'COORDINATOR', 'INTERVIEWER')")
    public ResponseEntity<CandidateResponse> getCandidateById(@PathVariable Long id) {
        CandidateResponse response = candidateService.getCandidateById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER', 'COORDINATOR')")
    public ResponseEntity<List<CandidateResponse>> getAllCandidates() {
        List<CandidateResponse> response = candidateService.getAllCandidates();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER', 'COORDINATOR')")
    public ResponseEntity<CandidateResponse> updateCandidate(@PathVariable Long id, @Valid @RequestBody CandidateRequest request) {
        CandidateResponse response = candidateService.updateCandidate(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
    public ResponseEntity<Void> deleteCandidate(@PathVariable Long id) {
        candidateService.deleteCandidate(id);
        return ResponseEntity.noContent().build();
    }
}