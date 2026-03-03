package com.credaxis.backend.auth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "login_audits")
public class LoginAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, length = 120)
    private String userId;

    @Column(name = "role", nullable = false, length = 20)
    private String role;

    @Column(name = "ip_address", nullable = false, length = 64)
    private String ipAddress;

    @Column(name = "login_at", nullable = false)
    private LocalDateTime loginAt;

    protected LoginAudit() {
    }

    public LoginAudit(String userId, String role, String ipAddress) {
        this.userId = userId;
        this.role = role;
        this.ipAddress = ipAddress;
    }

    @PrePersist
    void onCreate() {
        if (this.loginAt == null) {
            this.loginAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getRole() {
        return role;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public LocalDateTime getLoginAt() {
        return loginAt;
    }
}
