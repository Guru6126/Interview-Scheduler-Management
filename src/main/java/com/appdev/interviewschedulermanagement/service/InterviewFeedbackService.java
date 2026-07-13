package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.mapper.InterviewFeedbackMapper;
import com.appdev.interviewschedulermanagement.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class InterviewFeedbackService {
    private final InterviewFeedbackRepository repo;
    private final InterviewRepository interviewRepo;
    private final UserRepository userRepo;
    private final InterviewFeedbackMapper mapper;

    public InterviewFeedbackService(InterviewFeedbackRepository repo, InterviewRepository interviewRepo, UserRepository userRepo, InterviewFeedbackMapper mapper) {
        this.repo = repo; this.interviewRepo = interviewRepo; this.userRepo = userRepo; this.mapper = mapper;
    }

    public InterviewFeedbackResponse submitFeedback(InterviewFeedbackRequest req) {
        var interview = interviewRepo.findById(req.getInterviewId()).orElseThrow();
        var interviewer = userRepo.findById(req.getInterviewerId()).orElseThrow();
        return mapper.toResponse(repo.save(mapper.toEntity(req, interview, interviewer)));
    }

    @Transactional(readOnly = true)
    public InterviewFeedbackResponse getFeedbackById(Long id) {
        return mapper.toResponse(repo.findById(id).orElseThrow());
    }

    @Transactional(readOnly = true)
    public InterviewFeedbackResponse getFeedbackByInterview(Long interviewId) {
        return mapper.toResponse(repo.findByInterviewId(interviewId).orElseThrow());
    }
}