package com.credaxis.backend.payment;

import java.math.BigDecimal;

public record AdminTransactionAuditSummaryResponse(
        long totalTransactions,
        long loadMoneyCount,
        long payOutCount,
        long uniqueUsers,
        BigDecimal totalLoadMoneyAmount,
        BigDecimal totalPayOutAmount,
        BigDecimal netWalletMovement
) {
}
