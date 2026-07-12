package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.mapper.JobPositionMapper;
import com.appdev.interviewschedulermanagement.model.*;
import com.appdev.interviewschedulermanagement.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class JobPositionService {
    private final JobPositionRepository jobRepository;
    private final UserRepository userRepository;
    private final JobPositionMapper mapper;

    public JobPositionService(JobPositionRepository jobRepository, UserRepository userRepository, JobPositionMapper mapper) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    public JobPositionResponse createJob(JobPositionRequest request) {
        User creator = userRepository.findById(request.getCreatorId())
                .orElseThrow(() -> new RuntimeException("Creator not found"));
        return mapper.toResponse(jobRepository.save(mapper.toEntity(request, creator)));
    }

    @Transactional(readOnly = true)
    public List<JobPositionResponse> getAllJobs() {
        return jobRepository.findAll().stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public JobPositionResponse getJobById(Long id) {
        return mapper.toResponse(jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found")));
    }

    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) throw new RuntimeException("Job not found");
        jobRepository.deleteById(id);
    }
}