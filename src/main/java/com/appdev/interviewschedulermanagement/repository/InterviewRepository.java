package com.appdev.interviewschedulermanagement.repository;

import com.appdev.interviewschedulermanagement.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByCandidateId(Long candidateId);
    List<Interview> findByScheduledDate(LocalDate scheduledDate);
}