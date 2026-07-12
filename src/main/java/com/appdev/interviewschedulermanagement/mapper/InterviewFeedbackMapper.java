package com.appdev.interviewschedulermanagement.mapper;

import com.appdev.interviewschedulermanagement.dto.*;
import com.appdev.interviewschedulermanagement.model.*;
import org.springframework.stereotype.Component;

@Component
public class InterviewFeedbackMapper {
    public InterviewFeedback toEntity(InterviewFeedbackRequest req, Interview interview, User interviewer) {
        InterviewFeedback f = new InterviewFeedback();
        f.setInterview(interview);
        f.setInterviewer(interviewer);
        f.setOverallRating(req.getOverallRating());
        f.setTechnicalSkillsRating(req.getTechnicalSkillsRating());
        f.setCommunicationRating(req.getCommunicationRating());
        f.setCulturalFitRating(req.getCulturalFitRating());
        f.setProblemSolvingRating(req.getProblemSolvingRating());
        f.setStrengths(req.getStrengths());
        f.setWeaknesses(req.getWeaknesses());
        f.setDetailedFeedback(req.getDetailedFeedback());
        f.setRecommendation(req.getRecommendation());
        f.setWouldInterviewAgain(req.getWouldInterviewAgain());
        return f;
    }

    public InterviewFeedbackResponse toResponse(InterviewFeedback f) {
        InterviewFeedbackResponse r = new InterviewFeedbackResponse();
        r.setId(f.getId());
        r.setInterviewId(f.getInterview().getId());
        r.setInterviewerId(f.getInterviewer().getId());
        r.setInterviewerName(f.getInterviewer().getFirstName() + " " + f.getInterviewer().getLastName());
        r.setOverallRating(f.getOverallRating());
        r.setTechnicalSkillsRating(f.getTechnicalSkillsRating());
        r.setCommunicationRating(f.getCommunicationRating());
        r.setCulturalFitRating(f.getCulturalFitRating());
        r.setProblemSolvingRating(f.getProblemSolvingRating());
        r.setStrengths(f.getStrengths());
        r.setWeaknesses(f.getWeaknesses());
        r.setDetailedFeedback(f.getDetailedFeedback());
        r.setRecommendation(f.getRecommendation());
        r.setWouldInterviewAgain(f.getWouldInterviewAgain());
        r.setSubmittedDate(f.getSubmittedDate());
        return r;
    }
}