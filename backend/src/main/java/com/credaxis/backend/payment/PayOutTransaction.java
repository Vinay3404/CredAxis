package com.credaxis.backend.payment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "pay_out_transactions")
public class PayOutTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "bank_name", nullable = false, length = 150)
    private String bankName;

    @Column(name = "ifsc_code", nullable = false, length = 20)
    private String ifscCode;

    @Column(name = "beneficiary_name", nullable = false, length = 120)
    private String beneficiaryName;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected PayOutTransaction() {
    }

    public PayOutTransaction(
            String phoneNumber,
            String bankName,
            String ifscCode,
            String beneficiaryName
    ) {
        this.phoneNumber = phoneNumber;
        this.bankName = bankName;
        this.ifscCode = ifscCode;
        this.beneficiaryName = beneficiaryName;
    }

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getBankName() {
        return bankName;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public String getBeneficiaryName() {
        return beneficiaryName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
