package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.FeedbackRating;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FeedbackResponse {
    private Long id;
    private Long interviewId;
    private String candidateName;
    private String interviewerName;
    private Integer technicalScore;
    private Integer behavioralScore;
    private FeedbackRating rating;
    private String comments;
    private LocalDateTime createdDate;
}