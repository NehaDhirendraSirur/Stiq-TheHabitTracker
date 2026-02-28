package com.stiq.habittracker.controller;

import com.stiq.habittracker.dto.request.LoginRequest;
import com.stiq.habittracker.dto.request.RegisterRequest;
import com.stiq.habittracker.dto.response.AuthResponse;
import com.stiq.habittracker.service.UserService;
import com.stiq.habittracker.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        AuthResponse response = userService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        AuthResponse response = userService.login(request);
        return ResponseEntity
                .ok(ApiResponse.success("Login successful", response));
    }
}