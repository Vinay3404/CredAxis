package com.credaxis.backend.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

public record CreateUserRequest(
        @NotBlank(message = "userId is required")
        String userId,
        @NotBlank(message = "password is required")
        String password,
        @NotBlank(message = "fullName is required")
        String fullName,
        @NotBlank(message = "email is required")
        @Email(message = "email format is invalid")
        String email,
        @NotBlank(message = "phoneNumber is required")
        @Pattern(regexp = "^[6-9][0-9]{9}$", message = "phoneNumber must be a valid Indian mobile number")
        String phoneNumber,
        @NotBlank(message = "panNumber is required")
        @Pattern(regexp = "^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$", message = "panNumber must be valid PAN format")
        String panNumber,
        @NotBlank(message = "aadhaarNumber is required")
        @Pattern(regexp = "^[0-9]{12}$", message = "aadhaarNumber must be 12 digits")
        String aadhaarNumber,
        @NotNull(message = "dateOfBirth is required")
        @Past(message = "dateOfBirth must be in the past")
        LocalDate dateOfBirth,
        @NotBlank(message = "addressLine1 is required")
        String addressLine1,
        @NotBlank(message = "city is required")
        String city,
        @NotBlank(message = "state is required")
        String state,
        @NotBlank(message = "pincode is required")
        @Pattern(regexp = "^[0-9]{6}$", message = "pincode must be 6 digits")
        String pincode,
        @NotNull(message = "role is required")
        UserRole role,
        @NotNull(message = "kycStatus is required")
        KycStatus kycStatus
) {
}
