package com.appdev.interviewschedulermanagement.repository;

import com.appdev.interviewschedulermanagement.model.InterviewParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewParticipantRepository extends JpaRepository<InterviewParticipant, Long> {
    List<InterviewParticipant> findByInterviewId(Long interviewId);
    List<InterviewParticipant> findByUserId(Long userId);
    Optional<InterviewParticipant> findByInterviewIdAndUserId(Long interviewId, Long userId);
}