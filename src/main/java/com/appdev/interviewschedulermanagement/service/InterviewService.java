package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.exception.ResourceNotFoundException;
import com.appdev.interviewschedulermanagement.mapper.InterviewMapper;
import com.appdev.interviewschedulermanagement.model.*;
import com.appdev.interviewschedulermanagement.repository.*;
import com.appdev.interviewschedulermanagement.enums.InterviewStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List; // <-- Added missing import for List
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // Optimized for read operations
public class InterviewService {

    private final InterviewRepository repo;
    private final CandidateRepository candidateRepo;
    private final JobPositionRepository jobRepo;
    private final InterviewMapper mapper;

    private final AvailabilityRepository availabilityRepo;
    private final UserRepository userRepo;
    private final InterviewParticipantRepository participantRepo;
    private final NotificationRepository notificationRepo;
    private final AuditLogService auditLogService;

    private Long getCurrentUserId() {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            return ((User) auth.getPrincipal()).getId();
        }
        return null;
    }

    private void validateAvailabilityAndConflicts(Long candidateId, Long interviewerId, LocalDate date, LocalTime time, Integer duration, Long currentInterviewId) {
        if (duration == null) {
            duration = 60;
        }
        LocalTime endTime = time.plusMinutes(duration);

        // 1. Candidate Availability Validation
        Candidate candidate = candidateRepo.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found: " + candidateId));
        if (candidate.getAvailabilityDate() != null && !candidate.getAvailabilityDate().equals(date)) {
            throw new IllegalArgumentException("Conflict: Candidate availability date is " + candidate.getAvailabilityDate() + ", but the interview was scheduled for " + date);
        }

        // 2. Candidate Overlapping Interviews Validation
        List<Interview> candidateInterviews = repo.findByCandidateId(candidateId);
        for (Interview i : candidateInterviews) {
            if (currentInterviewId != null && i.getId().equals(currentInterviewId)) {
                continue;
            }
            if (i.getStatus() != InterviewStatus.CANCELLED && i.getScheduledDate().equals(date)) {
                int iDuration = i.getDuration() != null ? i.getDuration() : 60;
                LocalTime iStartTime = i.getScheduledTime();
                LocalTime iEndTime = iStartTime.plusMinutes(iDuration);
                if (time.isBefore(iEndTime) && endTime.isAfter(iStartTime)) {
                    throw new IllegalStateException("Conflict: Candidate already has another interview scheduled at this time (" + iStartTime + " - " + iEndTime + ")");
                }
            }
        }

        // 3. Interviewer Availability and Conflict Validation
        if (interviewerId != null) {
            User interviewer = userRepo.findById(interviewerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Interviewer not found: " + interviewerId));

            // Check if interviewer is available in the Availability table
            List<Availability> availabilities = availabilityRepo.findByUserId(interviewerId);
            boolean isAvailable = false;
            for (Availability a : availabilities) {
                if (Boolean.TRUE.equals(a.getIsAvailable()) && a.getAvailableDate().equals(date)) {
                    if (!time.isBefore(a.getStartTime()) && !endTime.isAfter(a.getEndTime())) {
                        isAvailable = true;
                        break;
                    }
                }
            }
            if (!isAvailable) {
                throw new IllegalStateException("Conflict: The selected interviewer is not available during the requested date/time slot.");
            }

            // Check for overlapping interviews for the interviewer
            List<InterviewParticipant> participations = participantRepo.findByUserId(interviewerId);
            for (InterviewParticipant p : participations) {
                Interview i = p.getInterview();
                if (currentInterviewId != null && i.getId().equals(currentInterviewId)) {
                    continue;
                }
                if (i.getStatus() != InterviewStatus.CANCELLED && i.getScheduledDate().equals(date)) {
                    int iDuration = i.getDuration() != null ? i.getDuration() : 60;
                    LocalTime iStartTime = i.getScheduledTime();
                    LocalTime iEndTime = iStartTime.plusMinutes(iDuration);
                    if (time.isBefore(iEndTime) && endTime.isAfter(iStartTime)) {
                        throw new IllegalStateException("Conflict: The selected interviewer already has another interview scheduled at this time (" + iStartTime + " - " + iEndTime + ")");
                    }
                }
            }
        }
    }

    // <-- ADDED: Fetches all interviews for the dashboard table view
    public List<InterviewResponse> getAllInterviews() {
        return repo.findAll().stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional // Override for write operations
    public InterviewResponse scheduleInterview(InterviewRequest req) {
        var candidate = candidateRepo.findById(req.getCandidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found: " + req.getCandidateId()));

        // Guard: Only candidates in SCREENING status can be scheduled for an interview
        if (candidate.getStatus() != com.appdev.interviewschedulermanagement.enums.CandidateStatus.SCREENING) {
            throw new IllegalStateException(
                "An interview can only be scheduled for a candidate in SCREENING status. " +
                "Current status: " + candidate.getStatus()
            );
        }
        
        var job = jobRepo.findById(req.getJobPositionId())
                .orElseThrow(() -> new ResourceNotFoundException("Job position not found: " + req.getJobPositionId()));
        
        validateAvailabilityAndConflicts(
            req.getCandidateId(), 
            req.getInterviewerId(), 
            req.getScheduledDate(), 
            req.getScheduledTime(), 
            req.getDuration(), 
            null
        );

        Interview i = repo.save(mapper.toEntity(req, candidate, job));

        // Auto-promote candidate status from SCREENING → INTERVIEWING
        candidate.setStatus(com.appdev.interviewschedulermanagement.enums.CandidateStatus.INTERVIEWING);
        candidateRepo.save(candidate);

        if (req.getInterviewerId() != null) {
            User interviewer = userRepo.findById(req.getInterviewerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Interviewer not found: " + req.getInterviewerId()));
            
            InterviewParticipant participant = new InterviewParticipant();
            participant.setInterview(i);
            participant.setUser(interviewer);
            participant.setRole(com.appdev.interviewschedulermanagement.enums.ParticipantRole.INTERVIEWER);
            participant.setIsRequired(true);
            participant.setAttendanceStatus(com.appdev.interviewschedulermanagement.enums.AttendanceStatus.PENDING);
            participantRepo.save(participant);

            // Send notification
            Notification notification = new Notification();
            notification.setUser(interviewer);
            notification.setTitle("New Interview Scheduled");
            notification.setMessage("You have been assigned to interview candidate " + candidate.getFirstName() + " " + candidate.getLastName() + " for " + job.getTitle() + " on " + i.getScheduledDate() + " at " + i.getScheduledTime() + ".");
            notification.setType(com.appdev.interviewschedulermanagement.enums.NotificationType.INTERVIEW_SCHEDULED);
            notification.setIsRead(false);
            notification.setCreatedDate(java.time.LocalDateTime.now());
            notification.setSentDate(java.time.LocalDateTime.now());
            notificationRepo.save(notification);
        }

        auditLogService.logEvent(
            getCurrentUserId(), 
            "SCHEDULE_INTERVIEW", 
            "Interview", 
            i.getId(), 
            "Scheduled interview for candidate " + candidate.getFirstName() + " " + candidate.getLastName() + ". Candidate status promoted to INTERVIEWING."
        );

        return mapper.toResponse(i);
    }

    public InterviewResponse getInterviewById(Long id) {
        return mapper.toResponse(repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with ID: " + id)));
    }

    @Transactional // Override for write operations
    public InterviewResponse updateInterviewDetails(Long id, InterviewRequest req) {
        Interview existing = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with ID: " + id));
    
        validateAvailabilityAndConflicts(
            existing.getCandidate().getId(), 
            req.getInterviewerId(), 
            req.getScheduledDate(), 
            req.getScheduledTime(), 
            req.getDuration(), 
            id
        );

        existing.setScheduledDate(req.getScheduledDate());
        existing.setScheduledTime(req.getScheduledTime());
        existing.setDuration(req.getDuration());
        existing.setMeetingLink(req.getMeetingLink());
        existing.setNotes(req.getNotes());
        existing.setLocation(req.getLocation());
        
        Interview updated = repo.saveAndFlush(existing);

        if (req.getInterviewerId() != null) {
            List<InterviewParticipant> participants = participantRepo.findByInterviewId(id);
            boolean found = false;
            for (InterviewParticipant p : participants) {
                if (p.getRole() == com.appdev.interviewschedulermanagement.enums.ParticipantRole.INTERVIEWER) {
                    if (!p.getUser().getId().equals(req.getInterviewerId())) {
                        User newInterviewer = userRepo.findById(req.getInterviewerId()).orElseThrow();
                        p.setUser(newInterviewer);
                        participantRepo.save(p);
                        
                        Notification notification = new Notification();
                        notification.setUser(newInterviewer);
                        notification.setTitle("New Interview Assigned");
                        notification.setMessage("You have been assigned to interview candidate " + existing.getCandidate().getFirstName() + " " + existing.getCandidate().getLastName() + " on " + updated.getScheduledDate() + ".");
                        notification.setType(com.appdev.interviewschedulermanagement.enums.NotificationType.INTERVIEW_SCHEDULED);
                        notification.setIsRead(false);
                        notification.setCreatedDate(java.time.LocalDateTime.now());
                        notification.setSentDate(java.time.LocalDateTime.now());
                        notificationRepo.save(notification);
                    }
                    found = true;
                    break;
                }
            }
            if (!found) {
                User interviewer = userRepo.findById(req.getInterviewerId()).orElseThrow();
                InterviewParticipant participant = new InterviewParticipant();
                participant.setInterview(existing);
                participant.setUser(interviewer);
                participant.setRole(com.appdev.interviewschedulermanagement.enums.ParticipantRole.INTERVIEWER);
                participant.setIsRequired(true);
                participant.setAttendanceStatus(com.appdev.interviewschedulermanagement.enums.AttendanceStatus.PENDING);
                participantRepo.save(participant);
            }
        }

        auditLogService.logEvent(
            getCurrentUserId(), 
            "UPDATE_INTERVIEW", 
            "Interview", 
            id, 
            "Updated interview details for candidate " + existing.getCandidate().getFirstName() + " " + existing.getCandidate().getLastName()
        );

        return mapper.toResponse(updated);
    }

    @Transactional // Override for write operations
    public void cancelInterview(Long id) {
        Interview interview = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with ID: " + id));
        interview.setStatus(InterviewStatus.CANCELLED);
        repo.save(interview);

        List<InterviewParticipant> participants = participantRepo.findByInterviewId(id);
        for (InterviewParticipant p : participants) {
            Notification notification = new Notification();
            notification.setUser(p.getUser());
            notification.setTitle("Interview Cancelled");
            notification.setMessage("The interview with candidate " + interview.getCandidate().getFirstName() + " " + interview.getCandidate().getLastName() + " scheduled for " + interview.getScheduledDate() + " has been cancelled.");
            notification.setType(com.appdev.interviewschedulermanagement.enums.NotificationType.INTERVIEW_CANCELLED);
            notification.setIsRead(false);
            notification.setCreatedDate(java.time.LocalDateTime.now());
            notification.setSentDate(java.time.LocalDateTime.now());
            notificationRepo.save(notification);
        }

        auditLogService.logEvent(
            getCurrentUserId(), 
            "CANCEL_INTERVIEW", 
            "Interview", 
            id, 
            "Cancelled interview for candidate " + interview.getCandidate().getFirstName() + " " + interview.getCandidate().getLastName()
        );
    }

    @Transactional // Override for write operations
    public InterviewResponse rescheduleInterview(Long id, LocalDate date, LocalTime time) {
        Interview interview = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with ID: " + id));
        
        Long interviewerId = null;
        List<InterviewParticipant> participants = participantRepo.findByInterviewId(id);
        if (!participants.isEmpty()) {
            interviewerId = participants.get(0).getUser().getId();
        }

        validateAvailabilityAndConflicts(
            interview.getCandidate().getId(), 
            interviewerId, 
            date, 
            time, 
            interview.getDuration(), 
            id
        );

        interview.setScheduledDate(date);
        interview.setScheduledTime(time);
        interview.setStatus(InterviewStatus.RESCHEDULED);
        Interview updated = repo.saveAndFlush(interview);

        for (InterviewParticipant p : participants) {
            Notification notification = new Notification();
            notification.setUser(p.getUser());
            notification.setTitle("Interview Rescheduled");
            notification.setMessage("The interview with candidate " + interview.getCandidate().getFirstName() + " " + interview.getCandidate().getLastName() + " has been rescheduled to " + date + " at " + time + ".");
            notification.setType(com.appdev.interviewschedulermanagement.enums.NotificationType.INTERVIEW_RESCHEDULED);
            notification.setIsRead(false);
            notification.setCreatedDate(java.time.LocalDateTime.now());
            notification.setSentDate(java.time.LocalDateTime.now());
            notificationRepo.save(notification);
        }

        auditLogService.logEvent(
            getCurrentUserId(), 
            "RESCHEDULE_INTERVIEW", 
            "Interview", 
            id, 
            "Rescheduled interview for candidate " + interview.getCandidate().getFirstName() + " " + interview.getCandidate().getLastName() + " to " + date + " at " + time
        );

        return mapper.toResponse(updated);
    }
}