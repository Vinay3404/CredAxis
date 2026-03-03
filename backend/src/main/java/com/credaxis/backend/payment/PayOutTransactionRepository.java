package com.credaxis.backend.payment;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PayOutTransactionRepository extends JpaRepository<PayOutTransaction, Long> {

    @Query("select coalesce(sum(p.amount), 0) from PayOutTransaction p")
    BigDecimal sumAllAmounts();

    List<PayOutTransaction> findAllByOrderByCreatedAtDesc();
}
