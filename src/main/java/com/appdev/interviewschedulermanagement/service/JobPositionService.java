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
@Transactional(readOnly = true)
public class JobPositionService {

    private final JobPositionRepository jobRepository;
    private final UserRepository userRepository;
    private final JobPositionMapper mapper;

    @Transactional
    public JobPositionResponse createJob(JobPositionRequest request) {
        // Resolve creator from the SecurityContext so we never rely on a client-supplied ID
        User creator;
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            creator = (User) authentication.getPrincipal();
        } else {
            // Fallback: use the creatorId from the request (for non-authenticated flows)
            creator = userRepository.findById(request.getCreatorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Creator not found with ID: " + request.getCreatorId()));
        }
        return mapper.toResponse(jobRepository.save(mapper.toEntity(request, creator)));
    }

    @Transactional
    public JobPositionResponse updateJob(Long id, JobPositionRequest request) {
        JobPosition existingJob = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + id));

        // Update fields (Assuming your mapper handles updating or you map fields manually)
        existingJob.setTitle(request.getTitle());
        existingJob.setDescription(request.getDescription());
        existingJob.setDepartment(request.getDepartment());
        existingJob.setLocation(request.getLocation());
        existingJob.setEmploymentType(request.getEmploymentType());
        existingJob.setSalaryMin(request.getSalaryMin());
        existingJob.setSalaryMax(request.getSalaryMax());
        existingJob.setRequirements(request.getRequirements());
        existingJob.setResponsibilities(request.getResponsibilities());
        existingJob.setStatus(request.getStatus()); // Crucial for closing/opening posts

        return mapper.toResponse(jobRepository.save(existingJob));
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

    @Transactional
    public void deleteJob(Long id) {
        JobPosition job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + id));
        jobRepository.delete(job);
    }
}