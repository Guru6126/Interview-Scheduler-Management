package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.exception.ResourceNotFoundException; // Ensure consistent exception
import com.appdev.interviewschedulermanagement.mapper.InterviewMapper;
import com.appdev.interviewschedulermanagement.model.*;
import com.appdev.interviewschedulermanagement.repository.*;
import com.appdev.interviewschedulermanagement.enums.InterviewStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // Optimized for read operations
public class InterviewService {

    private final InterviewRepository repo;
    private final CandidateRepository candidateRepo;
    private final JobPositionRepository jobRepo;
    private final InterviewMapper mapper;

    @Transactional // Override for write operations
    public InterviewResponse scheduleInterview(InterviewRequest req) {
        var candidate = candidateRepo.findById(req.getCandidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found: " + req.getCandidateId()));
        
        var job = jobRepo.findById(req.getJobPositionId())
                .orElseThrow(() -> new ResourceNotFoundException("Job position not found: " + req.getJobPositionId()));
        
        return mapper.toResponse(repo.save(mapper.toEntity(req, candidate, job)));
    }

    public InterviewResponse getInterviewById(Long id) {
        return mapper.toResponse(repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with ID: " + id)));
    }

    @Transactional // Override for write operations
    public InterviewResponse updateInterviewDetails(Long id, InterviewRequest req) {
        Interview existing = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with ID: " + id));
    
        // Apply updates
        existing.setScheduledDate(req.getScheduledDate());
        existing.setScheduledTime(req.getScheduledTime());
        existing.setDuration(req.getDuration());
        existing.setMeetingLink(req.getMeetingLink());
        existing.setNotes(req.getNotes());
        existing.setLocation(req.getLocation());
        
        return mapper.toResponse(repo.saveAndFlush(existing));
    }

    @Transactional // Override for write operations
    public void cancelInterview(Long id) {
        Interview interview = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with ID: " + id));
        interview.setStatus(InterviewStatus.CANCELLED);
        repo.save(interview);
    }

    @Transactional // Override for write operations
    public InterviewResponse rescheduleInterview(Long id, LocalDate date, LocalTime time) {
        Interview interview = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with ID: " + id));
        
        interview.setScheduledDate(date);
        interview.setScheduledTime(time);
        interview.setStatus(InterviewStatus.RESCHEDULED);
        
        return mapper.toResponse(repo.saveAndFlush(interview));
    }
}