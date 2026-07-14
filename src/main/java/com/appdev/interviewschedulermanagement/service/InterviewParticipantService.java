package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.InterviewParticipantRequest;
import com.appdev.interviewschedulermanagement.dto.InterviewParticipantResponse;
import com.appdev.interviewschedulermanagement.enums.AttendanceStatus;
import com.appdev.interviewschedulermanagement.exception.ResourceNotFoundException;
import com.appdev.interviewschedulermanagement.mapper.InterviewParticipantMapper;
import com.appdev.interviewschedulermanagement.repository.InterviewParticipantRepository;
import com.appdev.interviewschedulermanagement.repository.InterviewRepository;
import com.appdev.interviewschedulermanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // Class-level default: Reads are optimized
public class InterviewParticipantService {

    private final InterviewParticipantRepository repo;
    private final InterviewRepository iRepo;
    private final UserRepository uRepo;
    private final InterviewParticipantMapper mapper;

    @Transactional // Override to allow writes
    public InterviewParticipantResponse addParticipant(InterviewParticipantRequest req) {
        var interview = iRepo.findById(req.getInterviewId())
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found: " + req.getInterviewId()));
        
        var user = uRepo.findById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + req.getUserId()));
        
        return mapper.toResponse(repo.save(mapper.toEntity(req, interview, user)));
    }

    @Transactional // Override to allow writes
    public void removeParticipant(Long id) {
        // Atomic pattern: Ensure it exists before attempting to delete
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Participant not found with ID: " + id);
        }
        repo.deleteById(id);
    }

    @Transactional // Override to allow writes
    public InterviewParticipantResponse updateAttendance(Long interviewId, Long userId, AttendanceStatus status) {
        var participant = repo.findByInterviewIdAndUserId(interviewId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Participant not found for this interview"));
        
        participant.setAttendanceStatus(status);
        return mapper.toResponse(repo.save(participant));
    }

    // Inherits readOnly = true from class level
    public List<InterviewParticipantResponse> getParticipantsByInterview(Long interviewId) {
        return repo.findByInterviewId(interviewId).stream()
                .map(mapper::toResponse)
                .toList();
    }
}