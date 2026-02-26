package com.credaxis.backend.payment;

import java.math.BigDecimal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PayOutTransactionRepository extends JpaRepository<PayOutTransaction, Long> {

    @Query("select coalesce(sum(p.amount), 0) from PayOutTransaction p")
    BigDecimal sumAllAmounts();
}
