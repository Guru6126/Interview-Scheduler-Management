package com.appdev.interviewschedulermanagement.controller;

import com.appdev.interviewschedulermanagement.dto.FeedbackRequest;
import com.appdev.interviewschedulermanagement.dto.FeedbackResponse;
import com.appdev.interviewschedulermanagement.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<FeedbackResponse> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        FeedbackResponse response = feedbackService.submitFeedback(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/interview/{interviewId}")
    public ResponseEntity<FeedbackResponse> getFeedbackByInterviewId(@PathVariable Long interviewId) {
        FeedbackResponse response = feedbackService.getFeedbackByInterviewId(interviewId);
        return ResponseEntity.ok(response);
    }
}