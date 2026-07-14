package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.exception.ResourceNotFoundException;
import com.appdev.interviewschedulermanagement.mapper.JobPositionMapper;
import com.appdev.interviewschedulermanagement.model.*;
import com.appdev.interviewschedulermanagement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // Default: Reads are optimized
public class JobPositionService {

    private final JobPositionRepository jobRepository;
    private final UserRepository userRepository;
    private final JobPositionMapper mapper;

    @Transactional // Override to allow writes
    public JobPositionResponse createJob(JobPositionRequest request) {
        User creator = userRepository.findById(request.getCreatorId())
                .orElseThrow(() -> new ResourceNotFoundException("Creator not found with ID: " + request.getCreatorId()));
        
        return mapper.toResponse(jobRepository.save(mapper.toEntity(request, creator)));
    }

    public List<JobPositionResponse> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    public JobPositionResponse getJobById(Long id) {
        return mapper.toResponse(jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + id)));
    }

    @Transactional // Override to allow writes
    public void deleteJob(Long id) {
        // Atomic pattern: Find first, then delete. 
        // This ensures the record exists before deletion and handles the exception.
        JobPosition job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + id));
        jobRepository.delete(job);
    }
}