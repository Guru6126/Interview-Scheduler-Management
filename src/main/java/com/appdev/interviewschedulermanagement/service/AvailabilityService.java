package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.mapper.AvailabilityMapper;
import com.appdev.interviewschedulermanagement.model.Availability;
import com.appdev.interviewschedulermanagement.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AvailabilityService {
    private final AvailabilityRepository repo;
    private final UserRepository userRepo;
    private final AvailabilityMapper mapper;

    public AvailabilityService(AvailabilityRepository repo, UserRepository userRepo, AvailabilityMapper mapper) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.mapper = mapper;
    }

    public AvailabilityResponse createAvailability(AvailabilityRequest req) {
        var user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapper.toResponse(repo.save(mapper.toEntity(req, user)));
    }

    @Transactional(readOnly = true)
    public AvailabilityResponse getAvailabilityById(Long id) {
        return mapper.toResponse(repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Availability not found")));
    }

    @Transactional(readOnly = true)
    public List<AvailabilityResponse> getAvailabilityByInterviewer(Long interviewerId) {
        return repo.findByUserId(interviewerId).stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AvailabilityResponse> getAllAvailabilities() {
        return repo.findAll().stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    public AvailabilityResponse updateAvailability(Long id, AvailabilityRequest req) {
        Availability existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Availability not found"));
        
        // Update fields based on request
        existing.setAvailableDate(req.getAvailableDate());
        existing.setStartTime(req.getStartTime());
        existing.setEndTime(req.getEndTime());
        existing.setIsAvailable(req.getIsAvailable());
        existing.setRecurring(req.getRecurring());
        
        return mapper.toResponse(repo.save(existing));
    }

    public void deleteAvailability(Long id) {
        if (!repo.existsById(id)) throw new RuntimeException("Availability not found");
        repo.deleteById(id);
    }
}