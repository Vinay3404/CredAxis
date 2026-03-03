package com.credaxis.backend.user;

import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminUserService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserService(
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AdminUserResponse createUser(CreateUserRequest request) {
        if (userAccountRepository.findByUserId(request.userId().trim()).isPresent()) {
            throw new IllegalArgumentException("userId already exists");
        }

        UserAccount userAccount = new UserAccount(
                request.userId().trim(),
                passwordEncoder.encode(request.password()),
                request.role().name(),
                request.fullName().trim(),
                request.email().trim().toLowerCase(),
                request.phoneNumber().trim(),
                request.panNumber().trim().toUpperCase(),
                request.aadhaarNumber().trim(),
                request.dateOfBirth(),
                request.addressLine1().trim(),
                request.city().trim(),
                request.state().trim(),
                request.pincode().trim(),
                request.kycStatus().name()
        );

        UserAccount saved = userAccountRepository.save(userAccount);
        return toAdminUserResponse(saved);
    }

    public List<AdminUserResponse> getUsers() {
        return userAccountRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toAdminUserResponse)
                .toList();
    }

    private AdminUserResponse toAdminUserResponse(UserAccount userAccount) {
        return new AdminUserResponse(
                userAccount.getId(),
                userAccount.getUserId(),
                userAccount.getRole(),
                userAccount.getFullName(),
                userAccount.getEmail(),
                userAccount.getPhoneNumber(),
                userAccount.getPanNumber(),
                maskAadhaar(userAccount.getAadhaarNumber()),
                userAccount.getDateOfBirth(),
                userAccount.getAddressLine1(),
                userAccount.getCity(),
                userAccount.getState(),
                userAccount.getPincode(),
                userAccount.getKycStatus(),
                userAccount.getLastLoginIp(),
                userAccount.getLastLoginCountry(),
                userAccount.getLastLoginRegion(),
                userAccount.getLastLoginCity(),
                userAccount.getLastLoginLatitude(),
                userAccount.getLastLoginLongitude(),
                userAccount.getLastLoginAt(),
                userAccount.getCreatedAt()
        );
    }

    private String maskAadhaar(String aadhaarNumber) {
        if (aadhaarNumber == null || aadhaarNumber.length() < 4) {
            return "****";
        }
        String suffix = aadhaarNumber.substring(aadhaarNumber.length() - 4);
        return "********" + suffix;
    }
}
