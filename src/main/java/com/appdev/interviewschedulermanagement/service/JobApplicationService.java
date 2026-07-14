package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.enums.JobApplicationStatus;
import com.appdev.interviewschedulermanagement.exception.ResourceNotFoundException;
import com.appdev.interviewschedulermanagement.mapper.JobApplicationMapper;
import com.appdev.interviewschedulermanagement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // Default: Reads are optimized
public class JobApplicationService {

    private final JobApplicationRepository repo;
    private final CandidateRepository candidateRepo;
    private final JobPositionRepository jobRepo;
    private final JobApplicationMapper mapper;

    @Transactional // Override to allow writes
    public JobApplicationResponse applyToJob(JobApplicationRequest req) {
        var candidate = candidateRepo.findById(req.getCandidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with ID: " + req.getCandidateId()));
        
        var job = jobRepo.findById(req.getJobPositionId())
                .orElseThrow(() -> new ResourceNotFoundException("Job position not found with ID: " + req.getJobPositionId()));
        
        return mapper.toResponse(repo.save(mapper.toEntity(req, candidate, job)));
    }

    public JobApplicationResponse getApplicationById(Long id) {
        return mapper.toResponse(repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job application not found with ID: " + id)));
    }

    @Transactional // Override to allow writes
    public JobApplicationResponse updateApplicationStatus(Long id, JobApplicationStatus status) {
        var application = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job application not found with ID: " + id));
        
        application.setStatus(status);
        return mapper.toResponse(repo.save(application));
    }

    // Inherits readOnly = true from class level
    public List<JobApplicationResponse> getApplicationsByJob(Long jobId) {
        return repo.findByJobPositionId(jobId).stream()
                .map(mapper::toResponse)
                .toList();
    }
}