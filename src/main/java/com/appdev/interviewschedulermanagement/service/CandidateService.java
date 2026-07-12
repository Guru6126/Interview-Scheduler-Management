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

    public CandidateService(CandidateRepository candidateRepository, UserRepository userRepository, CandidateMapper candidateMapper) {
        this.candidateRepository = candidateRepository;
        this.userRepository = userRepository;
        this.candidateMapper = candidateMapper;
    }

    public CandidateResponse createCandidate(CandidateRequest request) {
        if (candidateRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Candidate email address is already registered");
        }

        User recruiter = null;
        if (request.getRecruiterId() != null) {
            recruiter = userRepository.findById(request.getRecruiterId())
                    .orElseThrow(() -> new RuntimeException("Assigned recruiter profile not found"));
        }

        Candidate candidate = candidateMapper.toEntity(request, recruiter);
        Candidate savedCandidate = candidateRepository.save(candidate);
        return candidateMapper.toResponse(savedCandidate);
    }

    @Transactional(readOnly = true)
    public CandidateResponse getCandidateById(Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate profiles matching ID not found: " + id));
        return candidateMapper.toResponse(candidate);
    }

    @Transactional(readOnly = true)
    public List<CandidateResponse> getAllCandidates() {
        return candidateRepository.findAll().stream()
                .map(candidateMapper::toResponse)
                .collect(Collectors.toList());
    }

    public CandidateResponse updateCandidate(Long id, CandidateRequest request) {
        Candidate existingCandidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate profiles matching ID not found: " + id));

        User recruiter = null;
        if (request.getRecruiterId() != null) {
            recruiter = userRepository.findById(request.getRecruiterId())
                    .orElseThrow(() -> new RuntimeException("Assigned recruiter profile not found"));
        }

        existingCandidate.setFirstName(request.getFirstName());
        existingCandidate.setLastName(request.getLastName());
        existingCandidate.setPhoneNumber(request.getPhoneNumber());
        existingCandidate.setResumeUrl(request.getResumeUrl());
        existingCandidate.setCurrentPosition(request.getCurrentPosition());
        existingCandidate.setCurrentCompany(request.getCurrentCompany());
        existingCandidate.setExperienceYears(request.getExperienceYears());
        existingCandidate.setExpectedSalary(request.getExpectedSalary());
        existingCandidate.setAvailabilityDate(request.getAvailabilityDate());
        existingCandidate.setStatus(request.getStatus());
        existingCandidate.setSource(request.getSource());
        existingCandidate.setRecruiter(recruiter);

        Candidate updatedCandidate = candidateRepository.save(existingCandidate);
        return candidateMapper.toResponse(updatedCandidate);
    }

    public void deleteCandidate(Long id) {
        if (!candidateRepository.existsById(id)) {
            throw new RuntimeException("Candidate profile missing with ID: " + id);
        }
        candidateRepository.deleteById(id);
    }
}