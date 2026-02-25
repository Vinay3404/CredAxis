package com.credaxis.backend.payment;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record LoadMoneyRequest(
        @NotBlank(message = "phoneNumber is required")
        String phoneNumber,
        @NotBlank(message = "name is required")
        String name,
        @NotNull(message = "amount is required")
        @DecimalMin(value = "0.01", message = "amount must be greater than zero")
        BigDecimal amount
) {
}
