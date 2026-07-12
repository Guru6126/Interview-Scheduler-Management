package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.JobPositionRequest;
import com.appdev.interviewschedulermanagement.dto.JobPositionResponse;
import com.appdev.interviewschedulermanagement.model.JobPosition;
import com.appdev.interviewschedulermanagement.model.User;
import com.appdev.interviewschedulermanagement.enums.JobPositionStatus;
import com.appdev.interviewschedulermanagement.mapper.JobPositionMapper;
import com.appdev.interviewschedulermanagement.repository.JobPositionRepository;
import com.appdev.interviewschedulermanagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class JobPositionService {

    private final JobPositionRepository jobPositionRepository;
    private final UserRepository userRepository;
    private final JobPositionMapper jobPositionMapper;

    public JobPositionService(JobPositionRepository jobPositionRepository, 
                              UserRepository userRepository, 
                              JobPositionMapper jobPositionMapper) {
        this.jobPositionRepository = jobPositionRepository;
        this.userRepository = userRepository;
        this.jobPositionMapper = jobPositionMapper;
    }

    public JobPositionResponse createJobPosition(JobPositionRequest request) {
        User creator = userRepository.findById(request.getCreatedById())
                .orElseThrow(() -> new RuntimeException("User profile not found with ID: " + request.getCreatedById()));

        JobPosition job = jobPositionMapper.toEntity(request, creator);
        JobPosition savedJob = jobPositionRepository.save(job);
        return jobPositionMapper.toResponse(savedJob);
    }

    @Transactional(readOnly = true)
    public JobPositionResponse getJobPositionById(Long id) {
        JobPosition job = jobPositionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job position not found with ID: " + id));
        return jobPositionMapper.toResponse(job);
    }

    @Transactional(readOnly = true)
    public List<JobPositionResponse> getAllJobPositions() {
        return jobPositionRepository.findAll().stream()
                .map(jobPositionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobPositionResponse> getJobPositionsByStatus(JobPositionStatus status) {
        return jobPositionRepository.findByStatus(status).stream()
                .map(jobPositionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public JobPositionResponse updateJobPosition(Long id, JobPositionRequest request) {
        JobPosition existingJob = jobPositionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job position not found with ID: " + id));

        User creator = userRepository.findById(request.getCreatedById())
                .orElseThrow(() -> new RuntimeException("User profile not found with ID: " + request.getCreatedById()));

        existingJob.setTitle(request.getTitle());
        existingJob.setDescription(request.getDescription());
        existingJob.setDepartment(request.getDepartment());
        existingJob.setLocation(request.getLocation());
        existingJob.setStatus(request.getStatus());
        existingJob.setCreatedBy(creator);

        JobPosition updatedJob = jobPositionRepository.save(existingJob);
        return jobPositionMapper.toResponse(updatedJob);
    }

    public void deleteJobPosition(Long id) {
        if (!jobPositionRepository.existsById(id)) {
            throw new RuntimeException("Job position not found with ID: " + id);
        }
        jobPositionRepository.deleteById(id);
    }
}