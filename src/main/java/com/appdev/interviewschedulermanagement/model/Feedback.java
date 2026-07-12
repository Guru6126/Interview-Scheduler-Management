package com.appdev.interviewschedulermanagement.model;

import com.appdev.interviewschedulermanagement.enums.FeedbackRating;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false, unique = true)
    private Interview interview;

    @Column(name = "technical_score", nullable = false)
    private Integer technicalScore;

    @Column(name = "behavioral_score", nullable = false)
    private Integer behavioralScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FeedbackRating rating;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(name = "created_date", updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdDate;
}