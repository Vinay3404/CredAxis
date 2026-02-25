package com.credaxis.backend.payment;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PayOutTransactionRepository extends JpaRepository<PayOutTransaction, Long> {
}
