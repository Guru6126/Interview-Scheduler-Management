package com.appdev.interviewschedulermanagement.service;

import com.appdev.interviewschedulermanagement.dto.NotificationRequest;
import com.appdev.interviewschedulermanagement.dto.NotificationResponse;
import com.appdev.interviewschedulermanagement.exception.ResourceNotFoundException;
import com.appdev.interviewschedulermanagement.mapper.NotificationMapper;
import com.appdev.interviewschedulermanagement.repository.NotificationRepository;
import com.appdev.interviewschedulermanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // Default: Reads are optimized
public class NotificationService {

    private final NotificationRepository repo;
    private final UserRepository userRepo;
    private final NotificationMapper mapper;

    @Transactional // Override to allow writes
    public NotificationResponse sendNotification(NotificationRequest req) {
        var user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + req.getUserId()));
        
        return mapper.toResponse(repo.save(mapper.toEntity(req, user)));
    }

    @Transactional // Override to allow writes
    public NotificationResponse markAsRead(Long id) {
        var notification = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + id));
        
        notification.setIsRead(true);
        return mapper.toResponse(repo.save(notification));
    }

    // Inherits readOnly = true from class level
    public List<NotificationResponse> getUserNotifications(Long userId) {
        return repo.findByUserId(userId).stream()
                .map(mapper::toResponse)
                .toList();
    }
}