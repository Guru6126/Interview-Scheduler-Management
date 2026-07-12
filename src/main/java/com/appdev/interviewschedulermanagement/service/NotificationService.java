package com.appdev.interviewschedulermanagement.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.appdev.interviewschedulermanagement.dto.NotificationRequest;
import com.appdev.interviewschedulermanagement.dto.NotificationResponse;
import com.appdev.interviewschedulermanagement.mapper.NotificationMapper;
import com.appdev.interviewschedulermanagement.repository.NotificationRepository;
import com.appdev.interviewschedulermanagement.repository.UserRepository;

import org.springframework.transaction.annotation.Transactional;

@Service @Transactional
public class NotificationService {
    private final NotificationRepository repo;
    private final UserRepository userRepo;
    private final NotificationMapper mapper;

    public NotificationService(NotificationRepository repo, UserRepository userRepo, NotificationMapper mapper) {
        this.repo = repo; this.userRepo = userRepo; this.mapper = mapper;
    }

    public NotificationResponse sendNotification(NotificationRequest req) {
        var user = userRepo.findById(req.getUserId()).orElseThrow();
        return mapper.toResponse(repo.save(mapper.toEntity(req, user)));
    }

    public NotificationResponse markAsRead(Long id) {
        var n = repo.findById(id).orElseThrow();
        n.setIsRead(true);
        return mapper.toResponse(repo.save(n));
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(Long userId) {
        return repo.findByUserId(userId).stream().map(mapper::toResponse).toList();
    }
}