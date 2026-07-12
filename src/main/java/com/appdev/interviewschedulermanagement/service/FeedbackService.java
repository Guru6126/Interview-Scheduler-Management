package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.FeedbackRequest;
import com.appdev.interviewschedulermanagement.dto.FeedbackResponse;
import com.appdev.interviewschedulermanagement.model.Feedback;
import com.appdev.interviewschedulermanagement.model.Interview;
import com.appdev.interviewschedulermanagement.mapper.FeedbackMapper;
import com.appdev.interviewschedulermanagement.repository.FeedbackRepository;
import com.appdev.interviewschedulermanagement.repository.InterviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final InterviewRepository interviewRepository;
    private final FeedbackMapper feedbackMapper;

    public FeedbackService(FeedbackRepository feedbackRepository,
                           InterviewRepository interviewRepository,
                           FeedbackMapper feedbackMapper) {
        this.feedbackRepository = feedbackRepository;
        this.interviewRepository = interviewRepository;
        this.feedbackMapper = feedbackMapper;
    }

    public FeedbackResponse submitFeedback(FeedbackRequest request) {
        if (feedbackRepository.existsByInterviewId(request.getInterviewId())) {
            throw new RuntimeException("Feedback assessment has already been submitted for this interview evaluation session");
        }

        Interview interview = interviewRepository.findById(request.getInterviewId())
                .orElseThrow(() -> new RuntimeException("Interview record matching evaluation request not found"));

        Feedback feedback = feedbackMapper.toEntity(request, interview);
        Feedback savedFeedback = feedbackRepository.save(feedback);
        return feedbackMapper.toResponse(savedFeedback);
    }

    @Transactional(readOnly = true)
    public FeedbackResponse getFeedbackByInterviewId(Long interviewId) {
        Feedback feedback = feedbackRepository.findByInterviewId(interviewId)
                .orElseThrow(() -> new RuntimeException("No evaluation notes found for this interview ID: " + interviewId));
        return feedbackMapper.toResponse(feedback);
    }
}