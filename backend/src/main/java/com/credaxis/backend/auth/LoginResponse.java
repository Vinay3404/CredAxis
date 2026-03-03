package com.credaxis.backend.auth;

public record LoginResponse(
        String message,
        String token,
        String userId,
        String role,
        String kycStatus,
        String loginIp,
        String loginCountry,
        String loginRegion,
        String loginCity,
        Double loginLatitude,
        Double loginLongitude
) {
}
