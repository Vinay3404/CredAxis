package com.credaxis.backend.payment;

import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final LoadMoneyTransactionRepository loadMoneyTransactionRepository;
    private final PayOutTransactionRepository payOutTransactionRepository;

    public PaymentService(
            LoadMoneyTransactionRepository loadMoneyTransactionRepository,
            PayOutTransactionRepository payOutTransactionRepository
    ) {
        this.loadMoneyTransactionRepository = loadMoneyTransactionRepository;
        this.payOutTransactionRepository = payOutTransactionRepository;
    }

    public PaymentActionResponse createLoadMoneyRequest(LoadMoneyRequest request) {
        LoadMoneyTransaction transaction = new LoadMoneyTransaction(
                request.phoneNumber(),
                request.name(),
                request.amount()
        );
        LoadMoneyTransaction saved = loadMoneyTransactionRepository.save(transaction);
        return new PaymentActionResponse("Load money request submitted successfully.", saved.getId());
    }

    public PaymentActionResponse createPayOutRequest(PayOutRequest request) {
        PayOutTransaction transaction = new PayOutTransaction(
                request.phoneNumber(),
                request.bankName(),
                request.ifscCode(),
                request.beneficiaryName()
        );
        PayOutTransaction saved = payOutTransactionRepository.save(transaction);
        return new PaymentActionResponse("Pay out request submitted successfully.", saved.getId());
    }
}
