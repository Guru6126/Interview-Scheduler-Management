package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.CandidateRequest;
import com.appdev.interviewschedulermanagement.dto.CandidateResponse;
import com.appdev.interviewschedulermanagement.model.Candidate;
import com.appdev.interviewschedulermanagement.model.User;
import com.appdev.interviewschedulermanagement.enums.CandidateStatus;
import com.appdev.interviewschedulermanagement.mapper.CandidateMapper;
import com.appdev.interviewschedulermanagement.repository.CandidateRepository;
import com.appdev.interviewschedulermanagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final CandidateMapper candidateMapper;

    public CandidateService(CandidateRepository candidateRepository, 
                            UserRepository userRepository, 
                            CandidateMapper candidateMapper) {
        this.candidateRepository = candidateRepository;
        this.userRepository = userRepository;
        this.candidateMapper = candidateMapper;
    }

    public CandidateResponse createCandidate(CandidateRequest request) {
        if (candidateRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Candidate email already exists");
        }

        User creator = userRepository.findById(request.getCreatedById())
                .orElseThrow(() -> new RuntimeException("User profile not found with ID: " + request.getCreatedById()));

        Candidate candidate = candidateMapper.toEntity(request, creator);
        Candidate savedCandidate = candidateRepository.save(candidate);
        return candidateMapper.toResponse(savedCandidate);
    }

    @Transactional(readOnly = true)
    public CandidateResponse getCandidateById(Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found with ID: " + id));
        return candidateMapper.toResponse(candidate);
    }

    @Transactional(readOnly = true)
    public List<CandidateResponse> getAllCandidates() {
        return candidateRepository.findAll().stream()
                .map(candidateMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CandidateResponse> getCandidatesByStatus(CandidateStatus status) {
        return candidateRepository.findByStatus(status).stream()
                .map(candidateMapper::toResponse)
                .collect(Collectors.toList());
    }

    public CandidateResponse updateCandidate(Long id, CandidateRequest request) {
        Candidate existingCandidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found with ID: " + id));

        if (!existingCandidate.getEmail().equals(request.getEmail()) && 
            candidateRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use by another candidate");
        }

        User creator = userRepository.findById(request.getCreatedById())
                .orElseThrow(() -> new RuntimeException("User profile not found with ID: " + request.getCreatedById()));

        existingCandidate.setFirstName(request.getFirstName());
        existingCandidate.setLastName(request.getLastName());
        existingCandidate.setEmail(request.getEmail());
        existingCandidate.setPhoneNumber(request.getPhoneNumber());
        existingCandidate.setResumeUrl(request.getResumeUrl());
        existingCandidate.setStatus(request.getStatus());
        existingCandidate.setCreatedBy(creator);

        Candidate updatedCandidate = candidateRepository.save(existingCandidate);
        return candidateMapper.toResponse(updatedCandidate);
    }

    public void deleteCandidate(Long id) {
        if (!candidateRepository.existsById(id)) {
            throw new RuntimeException("Candidate not found with ID: " + id);
        }
        candidateRepository.deleteById(id);
    }
}