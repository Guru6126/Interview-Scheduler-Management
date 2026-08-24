package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.CandidateRequest;
import com.appdev.interviewschedulermanagement.dto.CandidateResponse;
import com.appdev.interviewschedulermanagement.model.Candidate;
import com.appdev.interviewschedulermanagement.model.User;
import com.appdev.interviewschedulermanagement.mapper.CandidateMapper;
import com.appdev.interviewschedulermanagement.repository.CandidateRepository;
import com.appdev.interviewschedulermanagement.repository.UserRepository;
import com.appdev.interviewschedulermanagement.exception.ResourceNotFoundException; // Import your custom exception
import lombok.RequiredArgsConstructor; // Import Lombok
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException;
import com.appdev.interviewschedulermanagement.enums.UserRole;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Automatically handles constructor injection
@Transactional(readOnly = true) // Class-level default: read-only for safety/performance
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final CandidateMapper candidateMapper;

    @Transactional // Override to allow writes
    public CandidateResponse createCandidate(CandidateRequest request) {
        if (candidateRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Candidate email address is already registered");
        }

        User recruiter = null;
        if (request.getRecruiterId() != null) {
            recruiter = userRepository.findById(request.getRecruiterId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned recruiter profile not found"));
        }

        Candidate candidate = candidateMapper.toEntity(request, recruiter);
        Candidate savedCandidate = candidateRepository.save(candidate);
        return candidateMapper.toResponse(savedCandidate);
    }

    public CandidateResponse getCandidateById(Long id) {
        // Now using your custom ResourceNotFoundException
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found with ID: " + id));
        return candidateMapper.toResponse(candidate);
    }

    public List<CandidateResponse> getAllCandidates() {
        return candidateRepository.findAll().stream()
                .map(candidateMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional // Override to allow writes
    public CandidateResponse updateCandidate(Long id, CandidateRequest request) {
        Candidate existingCandidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found with ID: " + id));

        User recruiter = null;
        if (request.getRecruiterId() != null) {
            recruiter = userRepository.findById(request.getRecruiterId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned recruiter profile not found"));
        }

        // Enforce Coordinator restrictions
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User currentUser = (User) authentication.getPrincipal();
            if (currentUser.getRole() == UserRole.COORDINATOR) {
                if (!equalsNullable(request.getFirstName(), existingCandidate.getFirstName()) ||
                    !equalsNullable(request.getLastName(), existingCandidate.getLastName()) ||
                    !equalsNullable(request.getEmail(), existingCandidate.getEmail()) ||
                    !equalsNullable(request.getPhoneNumber(), existingCandidate.getPhoneNumber()) ||
                    !equalsNullable(request.getCurrentPosition(), existingCandidate.getCurrentPosition()) ||
                    !equalsNullable(request.getCurrentCompany(), existingCandidate.getCurrentCompany()) ||
                    !equalsNullable(request.getExperienceYears(), existingCandidate.getExperienceYears()) ||
                    !equalsNullable(request.getExpectedSalary(), existingCandidate.getExpectedSalary()) ||
                    !equalsNullable(request.getAvailabilityDate(), existingCandidate.getAvailabilityDate()) ||
                    !equalsNullable(request.getSource(), existingCandidate.getSource()) ||
                    !equalsNullable(request.getResumeUrl(), existingCandidate.getResumeUrl()) ||
                    !equalsRecruiter(request.getRecruiterId(), existingCandidate.getRecruiter())) {
                    throw new AccessDeniedException("Access Denied: Coordinators are only permitted to update candidate status.");
                }
            }
        }

        // Logic remains exactly as you wrote it
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

    private boolean equalsNullable(Object a, Object b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        if (a instanceof java.math.BigDecimal && b instanceof java.math.BigDecimal) {
            return ((java.math.BigDecimal) a).compareTo((java.math.BigDecimal) b) == 0;
        }
        return a.equals(b);
    }

    private boolean equalsRecruiter(Long recruiterId, User recruiter) {
        if (recruiterId == null && recruiter == null) return true;
        if (recruiterId == null || recruiter == null) return false;
        return recruiterId.equals(recruiter.getId());
    }

    @Transactional // Override to allow writes
    public void deleteCandidate(Long id) {
        // Atomic approach: Find first, then delete. 
        // This is safer and cleaner than using existsById() followed by deleteById()
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found with ID: " + id));
        candidateRepository.delete(candidate);
    }
}