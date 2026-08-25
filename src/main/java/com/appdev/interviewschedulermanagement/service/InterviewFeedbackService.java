package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.exception.ResourceNotFoundException;
import com.appdev.interviewschedulermanagement.mapper.InterviewFeedbackMapper;
import com.appdev.interviewschedulermanagement.repository.*;
import com.appdev.interviewschedulermanagement.model.*;
import lombok.RequiredArgsConstructor;

import java.util.List;

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
    private final NotificationRepository notificationRepo;
    private final AuditLogService auditLogService;

    @Transactional // Override to allow writes for submission
    public InterviewFeedbackResponse submitFeedback(InterviewFeedbackRequest req) {
        var interview = interviewRepo.findById(req.getInterviewId())
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with ID: " + req.getInterviewId()));
        
        var interviewer = userRepo.findById(req.getInterviewerId())
                .orElseThrow(() -> new ResourceNotFoundException("Interviewer not found with ID: " + req.getInterviewerId()));

        // Mark interview as COMPLETED
        interview.setStatus(com.appdev.interviewschedulermanagement.enums.InterviewStatus.COMPLETED);
        interviewRepo.save(interview);
        
        var response = mapper.toResponse(repo.save(mapper.toEntity(req, interview, interviewer)));

        // Notify recruiter
        var recruiter = interview.getCandidate().getRecruiter();
        if (recruiter != null) {
            Notification notification = new Notification();
            notification.setUser(recruiter);
            notification.setTitle("Interview Feedback Submitted");
            notification.setMessage("Interviewer " + interviewer.getFirstName() + " " + interviewer.getLastName() + " has submitted feedback for candidate " + interview.getCandidate().getFirstName() + " " + interview.getCandidate().getLastName() + ".");
            notification.setType(com.appdev.interviewschedulermanagement.enums.NotificationType.FEEDBACK_SUBMITTED);
            notification.setIsRead(false);
            notification.setCreatedDate(java.time.LocalDateTime.now());
            notification.setSentDate(java.time.LocalDateTime.now());
            notificationRepo.save(notification);
        }

        // Audit log
        auditLogService.logEvent(
            interviewer.getId(), 
            "SUBMIT_FEEDBACK", 
            "InterviewFeedback", 
            interview.getId(), 
            "Submitted feedback for candidate " + interview.getCandidate().getFirstName() + " " + interview.getCandidate().getLastName()
        );

        return response;
    }

    public InterviewFeedbackResponse getFeedbackById(Long id) {
        return mapper.toResponse(repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with ID: " + id)));
    }

    public InterviewFeedbackResponse getFeedbackByInterview(Long interviewId) {
        return mapper.toResponse(repo.findByInterviewId(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found for interview: " + interviewId)));
    }

    public List<InterviewFeedbackResponse> getFeedbackByInterviewer(Long interviewerId) {
        return repo.findByInterviewerId(interviewerId).stream()
                .map(mapper::toResponse)
                .toList();
    }
}