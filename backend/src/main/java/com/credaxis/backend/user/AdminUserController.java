package com.credaxis.backend.user;

import com.credaxis.backend.auth.AuthContextService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AuthContextService authContextService;
    private final AdminUserService adminUserService;

    public AdminUserController(
            AuthContextService authContextService,
            AdminUserService adminUserService
    ) {
        this.authContextService = authContextService;
        this.adminUserService = adminUserService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AdminUserResponse createUser(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @Valid @RequestBody CreateUserRequest request
    ) {
        authContextService.requireAdmin(authorizationHeader);
        return adminUserService.createUser(request);
    }

    @GetMapping
    public List<AdminUserResponse> listUsers(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        authContextService.requireAdmin(authorizationHeader);
        return adminUserService.getUsers();
    }
}
