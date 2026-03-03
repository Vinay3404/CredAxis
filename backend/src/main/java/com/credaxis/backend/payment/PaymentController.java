package com.credaxis.backend.payment;

import com.credaxis.backend.auth.AuthContextService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final AuthContextService authContextService;
    private final PaymentService paymentService;

    public PaymentController(
            AuthContextService authContextService,
            PaymentService paymentService
    ) {
        this.authContextService = authContextService;
        this.paymentService = paymentService;
    }

    @GetMapping("/wallet-summary")
    public WalletSummaryResponse getWalletSummary() {
        return paymentService.getWalletSummary();
    }

    @PostMapping("/load-money")
    @ResponseStatus(HttpStatus.CREATED)
    public PaymentActionResponse createLoadMoney(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @Valid @RequestBody LoadMoneyRequest request
    ) {
        String userId = authContextService.requireAuthenticated(authorizationHeader).userId();
        return paymentService.createLoadMoneyRequest(request, userId);
    }

    @PostMapping("/pay-out")
    @ResponseStatus(HttpStatus.CREATED)
    public PaymentActionResponse createPayOut(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @Valid @RequestBody PayOutRequest request
    ) {
        String userId = authContextService.requireAuthenticated(authorizationHeader).userId();
        return paymentService.createPayOutRequest(request, userId);
    }

    @GetMapping("/reports/load-money")
    public List<LoadMoneyReportItemResponse> getLoadMoneyReports() {
        return paymentService.getLoadMoneyReports();
    }

    @GetMapping("/reports/pay-out")
    public List<PayOutReportItemResponse> getPayOutReports() {
        return paymentService.getPayOutReports();
    }
}
