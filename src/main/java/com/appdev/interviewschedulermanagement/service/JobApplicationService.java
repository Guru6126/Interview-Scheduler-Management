package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.enums.JobApplicationStatus;
import com.appdev.interviewschedulermanagement.mapper.JobApplicationMapper;
import com.appdev.interviewschedulermanagement.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class JobApplicationService {
    private final JobApplicationRepository repo;
    private final CandidateRepository candidateRepo;
    private final JobPositionRepository jobRepo;
    private final JobApplicationMapper mapper;

    public JobApplicationService(JobApplicationRepository repo, CandidateRepository cRepo, JobPositionRepository jRepo, JobApplicationMapper mapper) {
        this.repo = repo; this.candidateRepo = cRepo; this.jobRepo = jRepo; this.mapper = mapper;
    }

    public JobApplicationResponse applyToJob(JobApplicationRequest req) {
        var c = candidateRepo.findById(req.getCandidateId()).orElseThrow();
        var j = jobRepo.findById(req.getJobPositionId()).orElseThrow();
        return mapper.toResponse(repo.save(mapper.toEntity(req, c, j)));
    }

    @Transactional(readOnly = true)
    public JobApplicationResponse getApplicationById(Long id) {
        return mapper.toResponse(repo.findById(id).orElseThrow());
    }

    public JobApplicationResponse updateApplicationStatus(Long id, JobApplicationStatus status) {
        var app = repo.findById(id).orElseThrow();
        app.setStatus(status);
        return mapper.toResponse(repo.save(app));
    }

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> getApplicationsByJob(Long jobId) {
        return repo.findByJobPositionId(jobId).stream().map(mapper::toResponse).collect(Collectors.toList());
    }
}