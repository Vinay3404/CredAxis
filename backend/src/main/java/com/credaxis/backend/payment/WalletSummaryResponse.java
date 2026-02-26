package com.credaxis.backend.payment;

import java.math.BigDecimal;

public record WalletSummaryResponse(
        BigDecimal totalLoadedAmount,
        BigDecimal totalPayOutAmount,
        BigDecimal availableWalletBalance
) {
}
