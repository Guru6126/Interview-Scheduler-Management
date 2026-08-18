package com.appdev.interviewschedulermanagement.config;

import com.appdev.interviewschedulermanagement.enums.UserRole;
import com.appdev.interviewschedulermanagement.model.User;
import com.appdev.interviewschedulermanagement.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminSeederConfig {

    @Bean
    public CommandLineRunner seedMasterAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            long adminCount = userRepository.countByRole(UserRole.ADMIN);

            if (adminCount == 0) {
                User masterAdmin = new User();
                masterAdmin.setFirstName("Master");
                masterAdmin.setLastName("Admin");
                masterAdmin.setUsername("admin"); // Required field
                masterAdmin.setEmail("admin@interviewsched.com");
                masterAdmin.setPassword(passwordEncoder.encode("AdminPassword123!"));
                masterAdmin.setRole(UserRole.ADMIN);
                masterAdmin.setIsActive(true); // Required non-null boolean field

                userRepository.save(masterAdmin);

                System.out.println("==================================================");
                System.out.println("🚀 DEFAULT MASTER ADMIN CREATED SUCCESSFULLY!");
                System.out.println("Username: admin");
                System.out.println("Email: admin@interviewsched.com");
                System.out.println("Password: AdminPassword123!");
                System.out.println("==================================================");
            }
        };
    }
}