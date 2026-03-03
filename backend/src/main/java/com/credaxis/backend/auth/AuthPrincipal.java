package com.credaxis.backend.auth;

public record AuthPrincipal(
        String userId,
        String role
) {
}
