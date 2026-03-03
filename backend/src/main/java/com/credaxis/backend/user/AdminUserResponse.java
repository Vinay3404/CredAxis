package com.credaxis.backend.user;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AdminUserResponse(
        Long id,
        String userId,
        String role,
        String fullName,
        String email,
        String phoneNumber,
        String panNumber,
        String aadhaarNumber,
        LocalDate dateOfBirth,
        String addressLine1,
        String city,
        String state,
        String pincode,
        String kycStatus,
        String lastLoginIp,
        String lastLoginCountry,
        String lastLoginRegion,
        String lastLoginCity,
        Double lastLoginLatitude,
        Double lastLoginLongitude,
        LocalDateTime lastLoginAt,
        LocalDateTime createdAt
) {
}
