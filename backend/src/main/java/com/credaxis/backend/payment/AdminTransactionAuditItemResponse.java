package com.credaxis.backend.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AdminTransactionAuditItemResponse(
        Long transactionId,
        String transactionType,
        String userId,
        String phoneNumber,
        String partyName,
        String bankName,
        String ifscCode,
        BigDecimal amount,
        LocalDateTime createdAt
) {
}
