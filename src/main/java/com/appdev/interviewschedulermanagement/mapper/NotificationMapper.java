package com.appdev.interviewschedulermanagement.mapper;

import org.springframework.stereotype.Component;

import com.appdev.interviewschedulermanagement.dto.NotificationRequest;
import com.appdev.interviewschedulermanagement.dto.NotificationResponse;
import com.appdev.interviewschedulermanagement.model.Notification;
import com.appdev.interviewschedulermanagement.model.User;

@Component
public class NotificationMapper {
    public Notification toEntity(NotificationRequest req, User user) {
        Notification n = new Notification();
        n.setUser(user);
        n.setTitle(req.getTitle());
        n.setMessage(req.getMessage());
        n.setType(req.getType());
        return n;
    }

    public NotificationResponse toResponse(Notification n) {
        NotificationResponse r = new NotificationResponse();
        r.setId(n.getId());
        r.setUserId(n.getUser().getId());
        r.setTitle(n.getTitle());
        r.setMessage(n.getMessage());
        r.setType(n.getType());
        r.setIsRead(n.getIsRead());
        r.setCreatedDate(n.getCreatedDate());
        return r;
    }
}