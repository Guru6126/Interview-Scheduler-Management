package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.exception.ResourceNotFoundException;
import com.appdev.interviewschedulermanagement.mapper.AvailabilityMapper;
import com.appdev.interviewschedulermanagement.model.Availability;
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