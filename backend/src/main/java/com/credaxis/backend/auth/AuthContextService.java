package com.credaxis.backend.auth;

import com.credaxis.backend.user.UserRole;
import org.springframework.stereotype.Service;

@Service
public class AuthContextService {

    private final JwtService jwtService;

    public AuthContextService(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    public AuthPrincipal requireAuthenticated(String authorizationHeader) {
        String token = extractBearerToken(authorizationHeader);
        String userId = jwtService.extractUserId(token);
        String role = jwtService.extractRole(token);
        return new AuthPrincipal(userId, role);
    }

    public AuthPrincipal requireAdmin(String authorizationHeader) {
        AuthPrincipal principal = requireAuthenticated(authorizationHeader);
        if (!UserRole.ADMIN.name().equals(principal.role())) {
            throw new ForbiddenAccessException("Admin access required");
        }
        return principal;
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            throw new UnauthorizedAccessException("Authorization header is required");
        }
        String normalized = authorizationHeader.trim();
        if (!normalized.startsWith("Bearer ")) {
            throw new UnauthorizedAccessException("Invalid authorization header");
        }
        String token = normalized.substring("Bearer ".length()).trim();
        if (token.isBlank()) {
            throw new UnauthorizedAccessException("Bearer token is missing");
        }
        return token;
    }
}
