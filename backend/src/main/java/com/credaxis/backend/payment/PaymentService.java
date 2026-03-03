package com.credaxis.backend.payment;

import java.math.BigDecimal;
import java.util.List;
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

    public PaymentActionResponse createLoadMoneyRequest(LoadMoneyRequest request, String userId) {
        LoadMoneyTransaction transaction = new LoadMoneyTransaction(
                userId,
                request.phoneNumber(),
                request.name(),
                request.amount()
        );
        LoadMoneyTransaction saved = loadMoneyTransactionRepository.save(transaction);
        return new PaymentActionResponse("Load money request submitted successfully.", saved.getId());
    }

    public PaymentActionResponse createPayOutRequest(PayOutRequest request, String userId) {
        WalletSummaryResponse walletSummary = getWalletSummary();
        if (request.amount().compareTo(walletSummary.availableWalletBalance()) > 0) {
            throw new InsufficientWalletBalanceException("Insufficient wallet balance for this pay out.");
        }

        PayOutTransaction transaction = new PayOutTransaction(
                userId,
                request.phoneNumber(),
                request.bankName(),
                request.ifscCode(),
                request.beneficiaryName(),
                request.amount()
        );
        PayOutTransaction saved = payOutTransactionRepository.save(transaction);
        return new PaymentActionResponse("Pay out request submitted successfully.", saved.getId());
    }

    public WalletSummaryResponse getWalletSummary() {
        BigDecimal totalLoaded = loadMoneyTransactionRepository.sumAllAmounts();
        BigDecimal totalPayOut = payOutTransactionRepository.sumAllAmounts();
        BigDecimal availableBalance = totalLoaded.subtract(totalPayOut);
        return new WalletSummaryResponse(totalLoaded, totalPayOut, availableBalance);
    }

    public List<LoadMoneyReportItemResponse> getLoadMoneyReports() {
        return loadMoneyTransactionRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(
                        transaction -> new LoadMoneyReportItemResponse(
                                transaction.getId(),
                                transaction.getUserId(),
                                transaction.getPhoneNumber(),
                                transaction.getName(),
                                transaction.getAmount(),
                                transaction.getCreatedAt()
                        )
                )
                .toList();
    }

    public List<PayOutReportItemResponse> getPayOutReports() {
        return payOutTransactionRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(
                        transaction -> new PayOutReportItemResponse(
                                transaction.getId(),
                                transaction.getUserId(),
                                transaction.getPhoneNumber(),
                                transaction.getBankName(),
                                transaction.getIfscCode(),
                                transaction.getBeneficiaryName(),
                                transaction.getAmount(),
                                transaction.getCreatedAt()
                        )
                )
                .toList();
    }
}
