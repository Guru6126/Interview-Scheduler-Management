package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.InterviewStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class InterviewRequest {

    @NotNull(message = "Candidate ID is required")
    private Long candidateId;

    @NotNull(message = "Job Position ID is required")
    private Long jobPositionId;

    @NotNull(message = "Interviewer ID is required")
    private Long interviewerId;

    @NotNull(message = "Organizer ID is required")
    private Long organizedById;

    @NotNull(message = "Scheduled time is required")
    private LocalDateTime scheduledTime;

    @NotNull(message = "Interview status is required")
    private InterviewStatus status;

    @Size(max = 255, message = "Meeting link cannot exceed 255 characters")
    private String meetingLink;
}