package com.credaxis.backend.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PayOutReportItemResponse(
        Long transactionId,
        String userId,
        String phoneNumber,
        String bankName,
        String ifscCode,
        String beneficiaryName,
        BigDecimal amount,
        LocalDateTime createdAt
) {
}
