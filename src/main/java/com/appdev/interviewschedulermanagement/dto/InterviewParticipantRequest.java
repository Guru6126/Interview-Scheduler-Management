package com.appdev.interviewschedulermanagement.dto;

import com.appdev.interviewschedulermanagement.enums.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InterviewParticipantRequest {
    @NotNull private Long interviewId;
    @NotNull private Long userId;
    @NotNull private ParticipantRole role;
    private Boolean isRequired = true;
}