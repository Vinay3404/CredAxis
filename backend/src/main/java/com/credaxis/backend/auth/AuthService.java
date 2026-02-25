package com.credaxis.backend.auth;

import com.credaxis.backend.user.UserAccount;
import com.credaxis.backend.user.UserAccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        UserAccount userAccount = userAccountRepository.findByUserId(request.userId())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid userId or password"));

        if (!passwordEncoder.matches(request.password(), userAccount.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid userId or password");
        }

        String token = jwtService.generateToken(userAccount.getUserId());
        return new LoginResponse("Login successful", token, userAccount.getUserId());
    }
}
