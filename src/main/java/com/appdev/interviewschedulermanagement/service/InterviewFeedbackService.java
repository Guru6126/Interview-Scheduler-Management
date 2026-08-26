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
    private final JobApplicationRepository jobApplicationRepo;

    @Transactional // Override to allow writes for submission
    public InterviewFeedbackResponse submitFeedback(InterviewFeedbackRequest req) {
        var interview = interviewRepo.findById(req.getInterviewId())
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with ID: " + req.getInterviewId()));
        
        var interviewer = userRepo.findById(req.getInterviewerId())
                .orElseThrow(() -> new ResourceNotFoundException("Interviewer not found with ID: " + req.getInterviewerId()));

        // 1. Mark interview as COMPLETED
        interview.setStatus(com.appdev.interviewschedulermanagement.enums.InterviewStatus.COMPLETED);
        interviewRepo.save(interview);
        
        var savedFeedback = repo.save(mapper.toEntity(req, interview, interviewer));
        interview.setFeedback(savedFeedback);
        var response = mapper.toResponse(savedFeedback);

        // 2. Automated Pipeline Status Transition: Synchronize linked JobApplication status
        if (interview.getCandidate() != null && interview.getJobPosition() != null) {
            var applicationOpt = jobApplicationRepo.findByCandidateIdAndJobPositionId(
                    interview.getCandidate().getId(),
                    interview.getJobPosition().getId()
            );

            if (applicationOpt.isPresent()) {
                var application = applicationOpt.get();
                var oldAppStatus = application.getStatus();
                var newAppStatus = determineApplicationStatus(req.getRecommendation(), req.getOverallRating());

                if (newAppStatus != null && newAppStatus != oldAppStatus) {
                    application.setStatus(newAppStatus);
                    jobApplicationRepo.save(application);

                    auditLogService.logEvent(
                        interviewer.getId(),
                        "UPDATE_APPLICATION_STATUS",
                        "JobApplication",
                        application.getId(),
                        "Automated status transition for candidate " + interview.getCandidate().getFirstName() + " " + interview.getCandidate().getLastName() + " from " + oldAppStatus + " to " + newAppStatus + " upon feedback submission"
                    );
                }
            }
        }

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

    private com.appdev.interviewschedulermanagement.enums.JobApplicationStatus determineApplicationStatus(String recommendation, Integer overallRating) {
        if (recommendation != null) {
            String recUpper = recommendation.trim().toUpperCase();
            if (recUpper.contains("RECOMMEND") && !recUpper.contains("NOT") && !recUpper.contains("REJECT")) {
                return com.appdev.interviewschedulermanagement.enums.JobApplicationStatus.SHORTLISTED;
            } else if (recUpper.contains("REJECT")) {
                return com.appdev.interviewschedulermanagement.enums.JobApplicationStatus.REJECTED;
            } else if (recUpper.contains("HOLD")) {
                return com.appdev.interviewschedulermanagement.enums.JobApplicationStatus.REVIEWING;
            }
        }

        if (overallRating != null) {
            if (overallRating >= 4) {
                return com.appdev.interviewschedulermanagement.enums.JobApplicationStatus.SHORTLISTED;
            } else if (overallRating <= 2) {
                return com.appdev.interviewschedulermanagement.enums.JobApplicationStatus.REJECTED;
            } else {
                return com.appdev.interviewschedulermanagement.enums.JobApplicationStatus.REVIEWING;
            }
        }

        return com.appdev.interviewschedulermanagement.enums.JobApplicationStatus.SHORTLISTED;
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