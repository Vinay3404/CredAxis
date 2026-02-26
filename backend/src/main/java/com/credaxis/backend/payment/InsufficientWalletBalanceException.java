package com.credaxis.backend.payment;

public class InsufficientWalletBalanceException extends RuntimeException {

    public InsufficientWalletBalanceException(String message) {
        super(message);
    }
}
