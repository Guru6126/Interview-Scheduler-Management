package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.InterviewParticipantRequest;
import com.appdev.interviewschedulermanagement.dto.InterviewParticipantResponse;
import com.appdev.interviewschedulermanagement.enums.AttendanceStatus;
import com.appdev.interviewschedulermanagement.mapper.InterviewParticipantMapper;
import com.appdev.interviewschedulermanagement.repository.InterviewParticipantRepository;
import com.appdev.interviewschedulermanagement.repository.InterviewRepository;
import com.appdev.interviewschedulermanagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class InterviewParticipantService {
    private final InterviewParticipantRepository repo;
    private final InterviewRepository iRepo;
    private final UserRepository uRepo;
    private final InterviewParticipantMapper mapper;

    public InterviewParticipantService(InterviewParticipantRepository repo, InterviewRepository iRepo, 
                                       UserRepository uRepo, InterviewParticipantMapper mapper) {
        this.repo = repo;
        this.iRepo = iRepo;
        this.uRepo = uRepo;
        this.mapper = mapper;
    }

    public InterviewParticipantResponse addParticipant(InterviewParticipantRequest req) {
        var i = iRepo.findById(req.getInterviewId()).orElseThrow();
        var u = uRepo.findById(req.getUserId()).orElseThrow();
        return mapper.toResponse(repo.save(mapper.toEntity(req, i, u)));
    }

    public void removeParticipant(Long id) {
        repo.deleteById(id);
    }

    public InterviewParticipantResponse updateAttendance(Long interviewId, Long userId, AttendanceStatus status) {
        var p = repo.findByInterviewIdAndUserId(interviewId, userId).orElseThrow();
        p.setAttendanceStatus(status);
        return mapper.toResponse(repo.save(p));
    }

    @Transactional(readOnly = true)
    public List<InterviewParticipantResponse> getParticipantsByInterview(Long interviewId) {
        return repo.findByInterviewId(interviewId).stream().map(mapper::toResponse).toList();
    }
}