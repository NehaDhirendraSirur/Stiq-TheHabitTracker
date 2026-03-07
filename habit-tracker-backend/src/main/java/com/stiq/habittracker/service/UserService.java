package com.stiq.habittracker.service;

import com.stiq.habittracker.dto.request.LoginRequest;
import com.stiq.habittracker.dto.request.RegisterRequest;
import com.stiq.habittracker.dto.response.AuthResponse;
import com.stiq.habittracker.dto.response.UserResponse;
import com.stiq.habittracker.entity.GrowthState;
import com.stiq.habittracker.entity.StreakFreezeWallet;
import com.stiq.habittracker.entity.StreakState;
import com.stiq.habittracker.entity.User;
import com.stiq.habittracker.enums.GrowthTheme;
import com.stiq.habittracker.exception.DuplicateResourceException;
import com.stiq.habittracker.exception.ResourceNotFoundException;
import com.stiq.habittracker.mapper.UserMapper;
import com.stiq.habittracker.repository.GrowthStateRepository;
import com.stiq.habittracker.repository.StreakFreezeWalletRepository;
import com.stiq.habittracker.repository.StreakStateRepository;
import com.stiq.habittracker.repository.UserRepository;
import com.stiq.habittracker.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;
    private final StreakFreezeWalletRepository walletRepository;
    private final StreakStateRepository streakStateRepository;
    private final GrowthStateRepository growthStateRepository;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .displayName(request.getDisplayName())
                .timezone(request.getTimezone())
                .build();
        userRepository.save(user);

        // Initialize wallet
        StreakFreezeWallet wallet = new StreakFreezeWallet();
        wallet.setUser(user);
        wallet.setTotalEarned(0);
        wallet.setTotalUsed(0);
        wallet.setAvailableFreezes(0);
        walletRepository.save(wallet);

        // Initialize streak state
        StreakState streakState = new StreakState();
        streakState.setUser(user);
        streakState.setCurrentOverallStreak(0);
        streakState.setLongestOverallStreak(0);
        streakStateRepository.save(streakState);

        // Initialize growth state
        GrowthState growthState = new GrowthState();
        growthState.setUser(user);
        growthState.setTheme(GrowthTheme.NATURE);
        growthState.setLevel(1);
        growthState.setTotalPoints(0);
        growthState.setVisualStage(1);
        growthState.setCustomName("Seed");
        growthStateRepository.save(growthState);

        // Return AFTER everything is saved
        String token = jwtUtil.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(userMapper.toResponse(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid password");
        }
        String token = jwtUtil.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(userMapper.toResponse(user))
                .build();
    }

    public User getUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    public UserResponse getUserResponse(UUID userId) {
        return userMapper.toResponse(getUserById(userId));
    }

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return getUserByEmail(email);
    }
}