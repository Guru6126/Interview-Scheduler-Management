package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.exception.ResourceNotFoundException;
import com.appdev.interviewschedulermanagement.mapper.AvailabilityMapper;
import com.appdev.interviewschedulermanagement.model.Availability;
import com.appdev.interviewschedulermanagement.model.User;
import com.appdev.interviewschedulermanagement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Removes the need for the manual constructor
@Transactional(readOnly = true) // Class-level default: faster read-only
public class AvailabilityService {
    
    private final AvailabilityRepository repo;
    private final UserRepository userRepo;
    private final AvailabilityMapper mapper;
    private final com.appdev.interviewschedulermanagement.mapper.UserMapper userMapper;
    private final InterviewParticipantRepository participantRepo;

    @Transactional // Override to allow writes
    public AvailabilityResponse createAvailability(AvailabilityRequest req) {
        var user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + req.getUserId()));
        return mapper.toResponse(repo.save(mapper.toEntity(req, user)));
    }

    public AvailabilityResponse getAvailabilityById(Long id) {
        return mapper.toResponse(repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Availability not found with ID: " + id)));
    }

    public List<AvailabilityResponse> getAvailabilityByInterviewer(Long interviewerId) {
        return repo.findByUserId(interviewerId).stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<AvailabilityResponse> getAllAvailabilities() {
        return repo.findAll().stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getAvailableInterviewers(java.time.LocalDate date, java.time.LocalTime time, Integer duration) {
        if (duration == null) {
            duration = 60;
        }
        java.time.LocalTime endTime = time.plusMinutes(duration);

        // 1. Get all active users with role INTERVIEWER
        List<User> interviewers = userRepo.findByRole(com.appdev.interviewschedulermanagement.enums.UserRole.INTERVIEWER);

        // 2. Filter interviewers who have active availability covering [time, endTime] on date
        // and do not have an overlapping non-cancelled interview
        return interviewers.stream().filter(interviewer -> {
            Long interviewerId = interviewer.getId();

            // Check availability table
            List<Availability> availabilities = repo.findByUserId(interviewerId);
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
                return false;
            }

            // Check for overlapping non-cancelled interviews
            List<com.appdev.interviewschedulermanagement.model.InterviewParticipant> participations = participantRepo.findByUserId(interviewerId);
            for (var p : participations) {
                var i = p.getInterview();
                if (i != null && i.getStatus() != com.appdev.interviewschedulermanagement.enums.InterviewStatus.CANCELLED && date.equals(i.getScheduledDate())) {
                    int iDuration = i.getDuration() != null ? i.getDuration() : 60;
                    java.time.LocalTime iStartTime = i.getScheduledTime();
                    java.time.LocalTime iEndTime = iStartTime.plusMinutes(iDuration);
                    if (time.isBefore(iEndTime) && endTime.isAfter(iStartTime)) {
                        return false; // Conflict found
                    }
                }
            }

            return true;
        }).map(userMapper::toResponse).collect(Collectors.toList());
    }

    @Transactional // Override to allow writes
    public AvailabilityResponse updateAvailability(Long id, AvailabilityRequest req) {
        Availability existing = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Availability not found with ID: " + id));
        
        existing.setAvailableDate(req.getAvailableDate());
        existing.setStartTime(req.getStartTime());
        existing.setEndTime(req.getEndTime());
        existing.setIsAvailable(req.getIsAvailable());
        existing.setRecurring(req.getRecurring());
        
        return mapper.toResponse(repo.save(existing));
    }

    @Transactional // Override to allow writes
    public void deleteAvailability(Long id) {
        // Atomic: Find first, then delete. Throws exception if not found, avoids double query.
        Availability availability = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Availability not found with ID: " + id));
        repo.delete(availability);
    }
}