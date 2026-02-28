package com.stiq.habittracker.controller;

import com.stiq.habittracker.dto.response.*;
import com.stiq.habittracker.service.*;
import com.stiq.habittracker.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DaySummaryService daySummaryService;
    private final StreakService streakService;
    private final GrowthService growthService;
    private final FreezeService freezeService;
    private final UserService userService;

    // GET /api/dashboard
    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {

        // Today's summary — builds one if doesn't exist yet
        DaySummaryResponse todaySummary = daySummaryService.getToday();

        // Overall streak state
        StreakStateResponse streakState;
        try {
            streakState = streakService.getOverallStreak();
        } catch (com.stiq.habittracker.exception.ResourceNotFoundException e) {
            streakState = StreakStateResponse.builder()
                    .currentOverallStreak(0)
                    .longestOverallStreak(0)
                    .lastSuccessDate(null)
                    .build();
        }

        // Growth state
        GrowthStateResponse growthState;
        try {
            growthState = growthService.getGrowthState();
        } catch (com.stiq.habittracker.exception.ResourceNotFoundException e) {
            growthState = GrowthStateResponse.builder()
                    .level(1)
                    .totalPoints(0)
                    .visualStage(1)
                    .customName("Seed")
                    .build();
        }

        // Freeze wallet
        FreezeWalletResponse freezeWallet;
        try {
            freezeWallet = freezeService.getWallet();
        } catch (com.stiq.habittracker.exception.ResourceNotFoundException e) {
            freezeWallet = FreezeWalletResponse.builder()
                    .totalEarned(0)
                    .totalUsed(0)
                    .availableFreezes(0)
                    .build();
        }

        DashboardResponse dashboard = DashboardResponse.builder()
                .todaySummary(todaySummary)
                .streakState(streakState)
                .growthState(growthState)
                .freezeWallet(freezeWallet)
                .build();

        return ResponseEntity
                .ok(ApiResponse.success(dashboard));
    }
}