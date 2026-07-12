package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.FeedbackRating;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FeedbackRequest {

    @NotNull(message = "Interview ID is required")
    private Long interviewId;

    @NotNull(message = "Technical score is required")
    @Min(value = 1, message = "Score must be at least 1")
    @Max(value = 10, message = "Score cannot exceed 10")
    private Integer technicalScore;

    @NotNull(message = "Behavioral score is required")
    @Min(value = 1, message = "Score must be at least 1")
    @Max(value = 10, message = "Score cannot exceed 10")
    private Integer behavioralScore;

    @NotNull(message = "Overall rating recommendation is required")
    private FeedbackRating rating;

    private String comments;
}