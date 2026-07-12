package com.appdev.interviewschedulermanagement.mapper;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.model.*;
import org.springframework.stereotype.Component;

@Component
public class AvailabilityMapper {
    public Availability toEntity(AvailabilityRequest req, User user) {
        Availability a = new Availability();
        a.setUser(user);
        a.setAvailableDate(req.getAvailableDate());
        a.setStartTime(req.getStartTime());
        a.setEndTime(req.getEndTime());
        a.setIsAvailable(req.getIsAvailable());
        a.setRecurring(req.getRecurring());
        return a;
    }

    public AvailabilityResponse toResponse(Availability e) {
        AvailabilityResponse r = new AvailabilityResponse();
        r.setId(e.getId());
        r.setUserId(e.getUser().getId());
        r.setUserName(e.getUser().getFirstName() + " " + e.getUser().getLastName());
        r.setAvailableDate(e.getAvailableDate());
        r.setStartTime(e.getStartTime());
        r.setEndTime(e.getEndTime());
        r.setIsAvailable(e.getIsAvailable());
        r.setRecurring(e.getRecurring());
        return r;
    }
}