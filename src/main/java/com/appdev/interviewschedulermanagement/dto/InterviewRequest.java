package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.InterviewStatus;
import com.appdev.interviewschedulermanagement.enums.InterviewType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class InterviewRequest {
    @NotNull private Long candidateId;
    @NotNull private Long jobPositionId;
    @NotNull private LocalDate scheduledDate;
    @NotNull private LocalTime scheduledTime;
    private Integer duration;
    @NotNull private InterviewType interviewType;
    private String meetingLink;
    private String location;
    private InterviewStatus status;
    private String notes;
}