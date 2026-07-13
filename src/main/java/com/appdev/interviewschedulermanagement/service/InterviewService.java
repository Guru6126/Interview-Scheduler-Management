package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.mapper.InterviewMapper;
import com.appdev.interviewschedulermanagement.model.*;
import com.appdev.interviewschedulermanagement.repository.*;

import jakarta.persistence.EntityNotFoundException;

import com.appdev.interviewschedulermanagement.enums.InterviewStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;

@Service
@Transactional
public class InterviewService {
    private final InterviewRepository repo;
    private final CandidateRepository candidateRepo;
    private final JobPositionRepository jobRepo;
    private final InterviewMapper mapper;

    public InterviewService(InterviewRepository repo, CandidateRepository candidateRepo, JobPositionRepository jobRepo, InterviewMapper mapper) {
        this.repo = repo; this.candidateRepo = candidateRepo; this.jobRepo = jobRepo; this.mapper = mapper;
    }

    public InterviewResponse scheduleInterview(InterviewRequest req) {
        var c = candidateRepo.findById(req.getCandidateId()).orElseThrow();
        var j = jobRepo.findById(req.getJobPositionId()).orElseThrow();
        return mapper.toResponse(repo.save(mapper.toEntity(req, c, j)));
    }

    @Transactional(readOnly = true)
    public InterviewResponse getInterviewById(Long id) {
        return mapper.toResponse(repo.findById(id).orElseThrow());
    }

    @Transactional
    public InterviewResponse updateInterviewDetails(Long id, InterviewRequest req) {
        Interview e = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Interview not found with id: " + id));
    
    // 2. Apply updates
    e.setScheduledDate(req.getScheduledDate());
    e.setScheduledTime(req.getScheduledTime());
    e.setDuration(req.getDuration());
    e.setMeetingLink(req.getMeetingLink());
    e.setNotes(req.getNotes());
    e.setLocation(req.getLocation());
    
    // 3. Force the flush to sync with the DB immediately
    // Use saveAndFlush so the database state is guaranteed before mapping
    Interview savedInterview = repo.saveAndFlush(e);
    
    System.out.println("DEBUG: Duration in entity is: " + savedInterview.getDuration());
    
    // 4. Return the response
    return mapper.toResponse(savedInterview);
    }

    public void cancelInterview(Long id) {
        Interview e = repo.findById(id).orElseThrow();
        e.setStatus(InterviewStatus.CANCELLED);
        repo.save(e);
    }

    public InterviewResponse rescheduleInterview(Long id, LocalDate date, LocalTime time) {
        Interview e = repo.findById(id).orElseThrow();
        e.setScheduledDate(date);
        e.setScheduledTime(time);
        e.setStatus(InterviewStatus.RESCHEDULED);
        Interview savedInterview = repo.saveAndFlush(e);
    
        // 4. Return the response using the SAVED entity
        return mapper.toResponse(savedInterview);
    }
}