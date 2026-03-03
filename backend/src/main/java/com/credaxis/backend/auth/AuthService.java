package com.credaxis.backend.auth;

import com.credaxis.backend.user.UserAccount;
import com.credaxis.backend.user.UserAccountRepository;
import com.credaxis.backend.user.UserRole;
import com.credaxis.backend.user.KycStatus;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final LoginAuditRepository loginAuditRepository;
    private final IpGeoLocationService ipGeoLocationService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserAccountRepository userAccountRepository,
            LoginAuditRepository loginAuditRepository,
            IpGeoLocationService ipGeoLocationService,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userAccountRepository = userAccountRepository;
        this.loginAuditRepository = loginAuditRepository;
        this.ipGeoLocationService = ipGeoLocationService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        UserAccount userAccount = userAccountRepository.findByUserId(request.userId())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid userId or password"));

        if (!passwordEncoder.matches(request.password(), userAccount.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid userId or password");
        }

        String role = (userAccount.getRole() == null || userAccount.getRole().isBlank())
                ? UserRole.USER.name()
                : userAccount.getRole();
        String kycStatus = (userAccount.getKycStatus() == null || userAccount.getKycStatus().isBlank())
                ? KycStatus.PENDING.name()
                : userAccount.getKycStatus();

        userAccount.setRole(role);
        userAccount.setKycStatus(kycStatus);
        String loginIp = resolveClientIp(httpRequest);
        IpGeoLocationResult geoLocation = ipGeoLocationService.resolve(loginIp);
        userAccount.setLastLoginIp(loginIp);
        userAccount.setLastLoginCountry(geoLocation.country());
        userAccount.setLastLoginRegion(geoLocation.region());
        userAccount.setLastLoginCity(geoLocation.city());
        userAccount.setLastLoginLatitude(geoLocation.latitude());
        userAccount.setLastLoginLongitude(geoLocation.longitude());
        userAccount.setLastLoginAt(LocalDateTime.now());
        userAccountRepository.save(userAccount);
        loginAuditRepository.save(new LoginAudit(userAccount.getUserId(), role, loginIp));

        String token = jwtService.generateToken(userAccount.getUserId(), role);
        return new LoginResponse(
                "Login successful",
                token,
                userAccount.getUserId(),
                role,
                kycStatus,
                loginIp,
                geoLocation.country(),
                geoLocation.region(),
                geoLocation.city(),
                geoLocation.latitude(),
                geoLocation.longitude()
        );
    }

    private String resolveClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            String[] addresses = xForwardedFor.split(",");
            if (addresses.length > 0 && !addresses[0].isBlank()) {
                return addresses[0].trim();
            }
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp.trim();
        }

        String remoteAddress = request.getRemoteAddr();
        return remoteAddress == null || remoteAddress.isBlank() ? "unknown" : remoteAddress;
    }
}
