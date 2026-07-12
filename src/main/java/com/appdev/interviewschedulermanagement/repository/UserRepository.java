package com.appdev.interviewschedulermanagement.repository;

import com.appdev.interviewschedulermanagement.model.User;
import com.appdev.interviewschedulermanagement.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByEmployeeId(String employeeId);
    List<User> findByRole(UserRole role);
}