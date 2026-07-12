package com.appdev.interviewschedulermanagement.repository;

import com.appdev.interviewschedulermanagement.model.Interview;
import com.appdev.interviewschedulermanagement.enums.InterviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByInterviewerId(Long interviewerId);
    List<Interview> findByCandidateId(Long candidateId);
    List<Interview> findByStatus(InterviewStatus status);
}