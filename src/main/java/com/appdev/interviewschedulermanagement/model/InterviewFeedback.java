package com.appdev.interviewschedulermanagement.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_feedbacks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    private Interview interview;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interviewer_id", nullable = false)
    private User interviewer;

    private Integer overallRating;
    private Integer technicalSkillsRating;
    private Integer communicationRating;
    private Integer culturalFitRating;
    private Integer problemSolvingRating;
    
    @Column(columnDefinition = "TEXT")
    private String strengths;
    @Column(columnDefinition = "TEXT")
    private String weaknesses;
    @Column(columnDefinition = "TEXT")
    private String detailedFeedback;
    
    private String recommendation;
    private Boolean wouldInterviewAgain;
    private LocalDateTime submittedDate = LocalDateTime.now();
}