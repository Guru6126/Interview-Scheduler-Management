package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.AvailabilityRequest;
import com.appdev.interviewschedulermanagement.dto.AvailabilityResponse;
import com.appdev.interviewschedulermanagement.model.Availability;
import com.appdev.interviewschedulermanagement.model.User;
import com.appdev.interviewschedulermanagement.enums.AvailabilityStatus;
import com.appdev.interviewschedulermanagement.mapper.AvailabilityMapper;
import com.appdev.interviewschedulermanagement.repository.AvailabilityRepository;
import com.appdev.interviewschedulermanagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AvailabilityService {

    private final AvailabilityRepository availabilityRepository;
    private final UserRepository userRepository;
    private final AvailabilityMapper availabilityMapper;

    public AvailabilityService(AvailabilityRepository availabilityRepository, 
                               UserRepository userRepository, 
                               AvailabilityMapper availabilityMapper) {
        this.availabilityRepository = availabilityRepository;
        this.userRepository = userRepository;
        this.availabilityMapper = availabilityMapper;
    }

    public AvailabilityResponse createAvailability(AvailabilityRequest request) {
        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new RuntimeException("Start time cannot be after end time");
        }

        User interviewer = userRepository.findById(request.getInterviewerId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getInterviewerId()));

        Availability availability = availabilityMapper.toEntity(request, interviewer);
        Availability savedAvailability = availabilityRepository.save(availability);
        return availabilityMapper.toResponse(savedAvailability);
    }

    @Transactional(readOnly = true)
    public AvailabilityResponse getAvailabilityById(Long id) {
        Availability availability = availabilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Availability slot not found with ID: " + id));
        return availabilityMapper.toResponse(availability);
    }

    @Transactional(readOnly = true)
    public List<AvailabilityResponse> getAvailabilityByInterviewer(Long interviewerId) {
        return availabilityRepository.findByInterviewerId(interviewerId).stream()
                .map(availabilityMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AvailabilityResponse> getAllAvailabilities() {
        return availabilityRepository.findAll().stream()
                .map(availabilityMapper::toResponse)
                .collect(Collectors.toList());
    }

    public AvailabilityResponse updateAvailability(Long id, AvailabilityRequest request) {
        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new RuntimeException("Start time cannot be after end time");
        }

        Availability existingAvailability = availabilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Availability slot not found with ID: " + id));

        User interviewer = userRepository.findById(request.getInterviewerId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getInterviewerId()));

        existingAvailability.setStartTime(request.getStartTime());
        existingAvailability.setEndTime(request.getEndTime());
        existingAvailability.setStatus(request.getStatus());
        existingAvailability.setInterviewer(interviewer);

        Availability updatedAvailability = availabilityRepository.save(existingAvailability);
        return availabilityMapper.toResponse(updatedAvailability);
    }

    public void deleteAvailability(Long id) {
        if (!availabilityRepository.existsById(id)) {
            throw new RuntimeException("Availability slot not found with ID: " + id);
        }
        availabilityRepository.deleteById(id);
    }
}