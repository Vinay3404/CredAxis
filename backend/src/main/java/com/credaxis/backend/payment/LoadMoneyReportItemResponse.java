package com.credaxis.backend.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record LoadMoneyReportItemResponse(
        Long transactionId,
        String userId,
        String phoneNumber,
        String customerName,
        BigDecimal amount,
        LocalDateTime createdAt
) {
}
