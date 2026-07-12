package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.InterviewRequest;
import com.appdev.interviewschedulermanagement.dto.InterviewResponse;
import com.appdev.interviewschedulermanagement.model.*;
import com.appdev.interviewschedulermanagement.enums.InterviewStatus;
import com.appdev.interviewschedulermanagement.mapper.InterviewMapper;
import com.appdev.interviewschedulermanagement.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final CandidateRepository candidateRepository;
    private final JobPositionRepository jobPositionRepository;
    private final UserRepository userRepository;
    private final InterviewMapper interviewMapper;

    public InterviewService(InterviewRepository interviewRepository,
                            CandidateRepository candidateRepository,
                            JobPositionRepository jobPositionRepository,
                            UserRepository userRepository,
                            InterviewMapper interviewMapper) {
        this.interviewRepository = interviewRepository;
        this.candidateRepository = candidateRepository;
        this.jobPositionRepository = jobPositionRepository;
        this.userRepository = userRepository;
        this.interviewMapper = interviewMapper;
    }

    public InterviewResponse scheduleInterview(InterviewRequest request) {
        Candidate candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new RuntimeException("Candidate profile not found"));
        JobPosition job = jobPositionRepository.findById(request.getJobPositionId())
                .orElseThrow(() -> new RuntimeException("Job Position not found"));
        User interviewer = userRepository.findById(request.getInterviewerId())
                .orElseThrow(() -> new RuntimeException("Interviewer user profile not found"));
        User organizer = userRepository.findById(request.getOrganizedById())
                .orElseThrow(() -> new RuntimeException("Organizer user profile not found"));

        Interview interview = interviewMapper.toEntity(request, candidate, job, interviewer, organizer);
        Interview savedInterview = interviewRepository.save(interview);
        return interviewMapper.toResponse(savedInterview);
    }

    @Transactional(readOnly = true)
    public InterviewResponse getInterviewById(Long id) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview meeting record not found with ID: " + id));
        return interviewMapper.toResponse(interview);
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> getInterviewsByInterviewer(Long interviewerId) {
        return interviewRepository.findByInterviewerId(interviewerId).stream()
                .map(interviewMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> getAllInterviews() {
        return interviewRepository.findAll().stream()
                .map(interviewMapper::toResponse)
                .collect(Collectors.toList());
    }

    public InterviewResponse updateInterview(Long id, InterviewRequest request) {
        Interview existingInterview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview meeting record not found"));

        Candidate candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        JobPosition job = jobPositionRepository.findById(request.getJobPositionId())
                .orElseThrow(() -> new RuntimeException("Job Position not found"));
        User interviewer = userRepository.findById(request.getInterviewerId())
                .orElseThrow(() -> new RuntimeException("Interviewer not found"));
        User organizer = userRepository.findById(request.getOrganizedById())
                .orElseThrow(() -> new RuntimeException("Organizer not found"));

        existingInterview.setCandidate(candidate);
        existingInterview.setJobPosition(job);
        existingInterview.setInterviewer(interviewer);
        existingInterview.setOrganizedBy(organizer);
        existingInterview.setScheduledTime(request.getScheduledTime());
        existingInterview.setStatus(request.getStatus());
        existingInterview.setMeetingLink(request.getMeetingLink());

        Interview updatedInterview = interviewRepository.save(existingInterview);
        return interviewMapper.toResponse(updatedInterview);
    }

    public void cancelInterview(Long id) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview record not found"));
        interview.setStatus(InterviewStatus.CANCELLED);
        interviewRepository.save(interview);
    }
}