package com.credaxis.backend.payment;

public record PaymentActionResponse(
        String message,
        Long requestId
) {
}
