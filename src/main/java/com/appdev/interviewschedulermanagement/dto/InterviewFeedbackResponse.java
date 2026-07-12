package com.appdev.interviewschedulermanagement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class InterviewFeedbackResponse {
    private Long id;
    private Long interviewId;
    private Long interviewerId;
    private String interviewerName;
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
    private LocalDateTime submittedDate;
}