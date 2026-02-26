package com.credaxis.backend.config;

import com.credaxis.backend.auth.InvalidCredentialsException;
import com.credaxis.backend.payment.InsufficientWalletBalanceException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleInvalidCredentials(InvalidCredentialsException ex) {
        return buildError(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        String message = "Invalid request";
        FieldError firstError = ex.getBindingResult().getFieldErrors().stream().findFirst().orElse(null);
        if (firstError != null && firstError.getDefaultMessage() != null) {
            message = firstError.getDefaultMessage();
        }
        return buildError(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(InsufficientWalletBalanceException.class)
    public ResponseEntity<Map<String, String>> handleInsufficientWalletBalance(InsufficientWalletBalanceException ex) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleUnexpected(Exception ex) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected server error");
    }

    private ResponseEntity<Map<String, String>> buildError(HttpStatus status, String message) {
        Map<String, String> body = new HashMap<>();
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}
