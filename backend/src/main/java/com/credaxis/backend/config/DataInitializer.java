package com.credaxis.backend.config;

import com.credaxis.backend.user.UserAccount;
import com.credaxis.backend.user.UserAccountRepository;
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
            if (userAccountRepository.findByUserId("admin").isEmpty()) {
                userAccountRepository.save(new UserAccount(
                        "admin",
                        passwordEncoder.encode("admin123")
                ));
            }
        };
    }
}
