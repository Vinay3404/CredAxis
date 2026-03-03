package com.credaxis.backend.config;

import com.credaxis.backend.user.UserAccount;
import com.credaxis.backend.user.UserAccountRepository;
import com.credaxis.backend.user.UserRole;
import com.credaxis.backend.user.KycStatus;
import java.time.LocalDate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedDefaultUser(
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            UserAccount admin = userAccountRepository.findByUserId("admin").orElse(null);
            if (admin == null) {
                userAccountRepository.save(new UserAccount(
                        "admin",
                        passwordEncoder.encode("admin123"),
                        UserRole.ADMIN.name(),
                        "System Administrator",
                        "admin@credaxis.com",
                        "9000000000",
                        "ABCDE1234F",
                        "123412341234",
                        LocalDate.of(1990, 1, 1),
                        "Admin Block, CredAxis HQ",
                        "Hyderabad",
                        "Telangana",
                        "500001",
                        KycStatus.VERIFIED.name()
                ));
            } else {
                boolean shouldUpdate = false;
                if (admin.getFullName() == null || admin.getFullName().isBlank()) {
                    admin.setFullName("System Administrator");
                    shouldUpdate = true;
                }
                if (admin.getEmail() == null || admin.getEmail().isBlank()) {
                    admin.setEmail("admin@credaxis.com");
                    shouldUpdate = true;
                }
                if (admin.getPhoneNumber() == null || admin.getPhoneNumber().isBlank()) {
                    admin.setPhoneNumber("9000000000");
                    shouldUpdate = true;
                }
                if (admin.getPanNumber() == null || admin.getPanNumber().isBlank()) {
                    admin.setPanNumber("ABCDE1234F");
                    shouldUpdate = true;
                }
                if (admin.getAadhaarNumber() == null || admin.getAadhaarNumber().isBlank()) {
                    admin.setAadhaarNumber("123412341234");
                    shouldUpdate = true;
                }
                if (admin.getDateOfBirth() == null) {
                    admin.setDateOfBirth(LocalDate.of(1990, 1, 1));
                    shouldUpdate = true;
                }
                if (admin.getAddressLine1() == null || admin.getAddressLine1().isBlank()) {
                    admin.setAddressLine1("Admin Block, CredAxis HQ");
                    shouldUpdate = true;
                }
                if (admin.getCity() == null || admin.getCity().isBlank()) {
                    admin.setCity("Hyderabad");
                    shouldUpdate = true;
                }
                if (admin.getState() == null || admin.getState().isBlank()) {
                    admin.setState("Telangana");
                    shouldUpdate = true;
                }
                if (admin.getPincode() == null || admin.getPincode().isBlank()) {
                    admin.setPincode("500001");
                    shouldUpdate = true;
                }
                if (admin.getRole() == null || admin.getRole().isBlank()) {
                    admin.setRole(UserRole.ADMIN.name());
                    shouldUpdate = true;
                }
                if (admin.getKycStatus() == null || admin.getKycStatus().isBlank()) {
                    admin.setKycStatus(KycStatus.VERIFIED.name());
                    shouldUpdate = true;
                }
                if (shouldUpdate) {
                    userAccountRepository.save(admin);
                }
            }
        };
    }
}
