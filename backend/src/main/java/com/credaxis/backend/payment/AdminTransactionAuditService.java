package com.credaxis.backend.payment;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;

@Service
public class AdminTransactionAuditService {

    private final LoadMoneyTransactionRepository loadMoneyTransactionRepository;
    private final PayOutTransactionRepository payOutTransactionRepository;

    public AdminTransactionAuditService(
            LoadMoneyTransactionRepository loadMoneyTransactionRepository,
            PayOutTransactionRepository payOutTransactionRepository
    ) {
        this.loadMoneyTransactionRepository = loadMoneyTransactionRepository;
        this.payOutTransactionRepository = payOutTransactionRepository;
    }

    public AdminTransactionAuditResponse getAuditTransactions(
            LocalDate fromDate,
            LocalDate toDate,
            String userId,
            AdminTransactionType transactionType,
            String phoneNumber,
            BigDecimal minAmount,
            BigDecimal maxAmount
    ) {
        AdminTransactionType effectiveType = transactionType == null ? AdminTransactionType.ALL : transactionType;

        Stream<AdminTransactionAuditItemResponse> loadMoneyStream =
                effectiveType == AdminTransactionType.PAY_OUT
                        ? Stream.empty()
                        : loadMoneyTransactionRepository.findAllByOrderByCreatedAtDesc().stream().map(
                        transaction -> new AdminTransactionAuditItemResponse(
                                transaction.getId(),
                                AdminTransactionType.LOAD_MONEY.name(),
                                safeUserId(transaction.getUserId()),
                                transaction.getPhoneNumber(),
                                transaction.getName(),
                                null,
                                null,
                                transaction.getAmount(),
                                transaction.getCreatedAt()
                        )
                );

        Stream<AdminTransactionAuditItemResponse> payOutStream =
                effectiveType == AdminTransactionType.LOAD_MONEY
                        ? Stream.empty()
                        : payOutTransactionRepository.findAllByOrderByCreatedAtDesc().stream().map(
                        transaction -> new AdminTransactionAuditItemResponse(
                                transaction.getId(),
                                AdminTransactionType.PAY_OUT.name(),
                                safeUserId(transaction.getUserId()),
                                transaction.getPhoneNumber(),
                                transaction.getBeneficiaryName(),
                                transaction.getBankName(),
                                transaction.getIfscCode(),
                                transaction.getAmount(),
                                transaction.getCreatedAt()
                        )
                );

        List<AdminTransactionAuditItemResponse> filtered = Stream.concat(loadMoneyStream, payOutStream)
                .filter(item -> matchesUser(item, userId))
                .filter(item -> matchesPhone(item, phoneNumber))
                .filter(item -> matchesDateRange(item, fromDate, toDate))
                .filter(item -> matchesAmountRange(item, minAmount, maxAmount))
                .sorted(Comparator.comparing(AdminTransactionAuditItemResponse::createdAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .toList();

        AdminTransactionAuditSummaryResponse summary = buildSummary(filtered);
        return new AdminTransactionAuditResponse(summary, filtered);
    }

    private AdminTransactionAuditSummaryResponse buildSummary(List<AdminTransactionAuditItemResponse> transactions) {
        long totalTransactions = transactions.size();
        long loadCount = transactions.stream()
                .filter(item -> AdminTransactionType.LOAD_MONEY.name().equals(item.transactionType()))
                .count();
        long payOutCount = transactions.stream()
                .filter(item -> AdminTransactionType.PAY_OUT.name().equals(item.transactionType()))
                .count();

        long uniqueUsers = transactions.stream()
                .map(AdminTransactionAuditItemResponse::userId)
                .filter(Objects::nonNull)
                .filter(value -> !value.isBlank())
                .distinct()
                .count();

        BigDecimal totalLoadAmount = transactions.stream()
                .filter(item -> AdminTransactionType.LOAD_MONEY.name().equals(item.transactionType()))
                .map(AdminTransactionAuditItemResponse::amount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalPayOutAmount = transactions.stream()
                .filter(item -> AdminTransactionType.PAY_OUT.name().equals(item.transactionType()))
                .map(AdminTransactionAuditItemResponse::amount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new AdminTransactionAuditSummaryResponse(
                totalTransactions,
                loadCount,
                payOutCount,
                uniqueUsers,
                totalLoadAmount,
                totalPayOutAmount,
                totalLoadAmount.subtract(totalPayOutAmount)
        );
    }

    private boolean matchesUser(AdminTransactionAuditItemResponse item, String userId) {
        if (userId == null || userId.isBlank()) {
            return true;
        }
        return item.userId() != null && item.userId().equalsIgnoreCase(userId.trim());
    }

    private boolean matchesPhone(AdminTransactionAuditItemResponse item, String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isBlank()) {
            return true;
        }
        return item.phoneNumber() != null && item.phoneNumber().contains(phoneNumber.trim());
    }

    private boolean matchesDateRange(
            AdminTransactionAuditItemResponse item,
            LocalDate fromDate,
            LocalDate toDate
    ) {
        if (item.createdAt() == null) {
            return false;
        }
        LocalDate transactionDate = item.createdAt().toLocalDate();
        if (fromDate != null && transactionDate.isBefore(fromDate)) {
            return false;
        }
        if (toDate != null && transactionDate.isAfter(toDate)) {
            return false;
        }
        return true;
    }

    private boolean matchesAmountRange(
            AdminTransactionAuditItemResponse item,
            BigDecimal minAmount,
            BigDecimal maxAmount
    ) {
        if (minAmount != null && item.amount().compareTo(minAmount) < 0) {
            return false;
        }
        if (maxAmount != null && item.amount().compareTo(maxAmount) > 0) {
            return false;
        }
        return true;
    }

    private String safeUserId(String userId) {
        return userId == null || userId.isBlank() ? "unknown" : userId;
    }
}
