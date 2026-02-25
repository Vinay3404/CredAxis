package com.credaxis.backend.auth;

public record LoginResponse(
        String message,
        String token,
        String userId
) {
}
