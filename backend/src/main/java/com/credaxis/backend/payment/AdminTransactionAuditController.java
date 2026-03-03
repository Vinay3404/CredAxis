package com.credaxis.backend.payment;

import com.credaxis.backend.auth.AuthContextService;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/audit")
public class AdminTransactionAuditController {

    private final AuthContextService authContextService;
    private final AdminTransactionAuditService adminTransactionAuditService;

    public AdminTransactionAuditController(
            AuthContextService authContextService,
            AdminTransactionAuditService adminTransactionAuditService
    ) {
        this.authContextService = authContextService;
        this.adminTransactionAuditService = adminTransactionAuditService;
    }

    @GetMapping("/transactions")
    public AdminTransactionAuditResponse getAuditTransactions(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate toDate,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) AdminTransactionType transactionType,
            @RequestParam(required = false) String phoneNumber,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount
    ) {
        authContextService.requireAdmin(authorizationHeader);
        return adminTransactionAuditService.getAuditTransactions(
                fromDate,
                toDate,
                userId,
                transactionType,
                phoneNumber,
                minAmount,
                maxAmount
        );
    }
}
