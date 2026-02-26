package com.credaxis.backend.payment;

import java.math.BigDecimal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface LoadMoneyTransactionRepository extends JpaRepository<LoadMoneyTransaction, Long> {

    @Query("select coalesce(sum(l.amount), 0) from LoadMoneyTransaction l")
    BigDecimal sumAllAmounts();
}
