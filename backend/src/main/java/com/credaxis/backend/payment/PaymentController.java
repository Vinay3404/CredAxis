package com.credaxis.backend.payment;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/load-money")
    @ResponseStatus(HttpStatus.CREATED)
    public PaymentActionResponse createLoadMoney(@Valid @RequestBody LoadMoneyRequest request) {
        return paymentService.createLoadMoneyRequest(request);
    }

    @PostMapping("/pay-out")
    @ResponseStatus(HttpStatus.CREATED)
    public PaymentActionResponse createPayOut(@Valid @RequestBody PayOutRequest request) {
        return paymentService.createPayOutRequest(request);
    }
}
