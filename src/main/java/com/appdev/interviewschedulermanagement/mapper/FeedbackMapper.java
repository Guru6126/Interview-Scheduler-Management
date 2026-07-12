package com.appdev.interviewschedulermanagement.mapper;

import com.appdev.interviewschedulermanagement.dto.FeedbackRequest;
import com.appdev.interviewschedulermanagement.dto.FeedbackResponse;
import com.appdev.interviewschedulermanagement.model.Feedback;
import com.appdev.interviewschedulermanagement.model.Interview;
import org.springframework.stereotype.Component;

@Component
public class FeedbackMapper {

    public Feedback toEntity(FeedbackRequest request, Interview interview) {
        if (request == null) {
            return null;
        }

        Feedback feedback = new Feedback();
        feedback.setInterview(interview);
        feedback.setTechnicalScore(request.getTechnicalScore());
        feedback.setBehavioralScore(request.getBehavioralScore());
        feedback.setRating(request.getRating());
        feedback.setComments(request.getComments());

        return feedback;
    }

    public FeedbackResponse toResponse(Feedback entity) {
        if (entity == null) {
            return null;
        }

        FeedbackResponse response = new FeedbackResponse();
        response.setId(entity.getId());
        response.setTechnicalScore(entity.getTechnicalScore());
        response.setBehavioralScore(entity.getBehavioralScore());
        response.setRating(entity.getRating());
        response.setComments(entity.getComments());
        response.setCreatedDate(entity.getCreatedDate());

        if (entity.getInterview() != null) {
            response.setInterviewId(entity.getInterview().getId());
            if (entity.getInterview().getCandidate() != null) {
                response.setCandidateName(entity.getInterview().getCandidate().getFirstName() + " " + entity.getInterview().getCandidate().getLastName());
            }
            if (entity.getInterview().getInterviewer() != null) {
                response.setInterviewerName(entity.getInterview().getInterviewer().getFirstName() + " " + entity.getInterview().getInterviewer().getLastName());
            }
        }

        return response;
    }
}