package com.credaxis.backend.payment;

import jakarta.validation.constraints.NotBlank;

public record PayOutRequest(
        @NotBlank(message = "phoneNumber is required")
        String phoneNumber,
        @NotBlank(message = "bankName is required")
        String bankName,
        @NotBlank(message = "ifscCode is required")
        String ifscCode,
        @NotBlank(message = "beneficiaryName is required")
        String beneficiaryName
) {
}
