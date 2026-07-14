package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.exception.ResourceNotFoundException;
import com.appdev.interviewschedulermanagement.mapper.InterviewFeedbackMapper;
import com.appdev.interviewschedulermanagement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // Default: Reads are optimized
public class InterviewFeedbackService {

    private final InterviewFeedbackRepository repo;
    private final InterviewRepository interviewRepo;
    private final UserRepository userRepo;
    private final InterviewFeedbackMapper mapper;

    @Transactional // Override to allow writes for submission
    public InterviewFeedbackResponse submitFeedback(InterviewFeedbackRequest req) {
        var interview = interviewRepo.findById(req.getInterviewId())
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with ID: " + req.getInterviewId()));
        
        var interviewer = userRepo.findById(req.getInterviewerId())
                .orElseThrow(() -> new ResourceNotFoundException("Interviewer not found with ID: " + req.getInterviewerId()));
        
        return mapper.toResponse(repo.save(mapper.toEntity(req, interview, interviewer)));
    }

    public InterviewFeedbackResponse getFeedbackById(Long id) {
        return mapper.toResponse(repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with ID: " + id)));
    }

    public InterviewFeedbackResponse getFeedbackByInterview(Long interviewId) {
        return mapper.toResponse(repo.findByInterviewId(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found for interview: " + interviewId)));
    }
}