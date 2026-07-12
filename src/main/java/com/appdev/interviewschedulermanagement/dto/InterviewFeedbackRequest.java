package com.appdev.interviewschedulermanagement.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InterviewFeedbackRequest {
    @NotNull private Long interviewId;
    @NotNull private Long interviewerId;
    private Integer overallRating;
    private Integer technicalSkillsRating;
    private Integer communicationRating;
    private Integer culturalFitRating;
    private Integer problemSolvingRating;
    private String strengths;
    private String weaknesses;
    private String detailedFeedback;
    private String recommendation;
    private Boolean wouldInterviewAgain;
}