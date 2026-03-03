package com.credaxis.backend.payment;

import java.util.List;

public record AdminTransactionAuditResponse(
        AdminTransactionAuditSummaryResponse summary,
        List<AdminTransactionAuditItemResponse> transactions
) {
}
