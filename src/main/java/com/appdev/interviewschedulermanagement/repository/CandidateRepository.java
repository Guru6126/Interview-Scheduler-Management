package com.appdev.interviewschedulermanagement.repository;

import com.appdev.interviewschedulermanagement.model.Candidate;
import com.appdev.interviewschedulermanagement.enums.CandidateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    Optional<Candidate> findByEmail(String email);
    List<Candidate> findByStatus(CandidateStatus status);
    List<Candidate> findByCreatedById(Long userId);
    boolean existsByEmail(String email);
}