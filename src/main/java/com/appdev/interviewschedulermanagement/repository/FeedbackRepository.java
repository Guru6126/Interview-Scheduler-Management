package com.appdev.interviewschedulermanagement.repository;

import com.appdev.interviewschedulermanagement.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Optional<Feedback> findByInterviewId(Long interviewId);
    boolean existsByInterviewId(Long interviewId);
}