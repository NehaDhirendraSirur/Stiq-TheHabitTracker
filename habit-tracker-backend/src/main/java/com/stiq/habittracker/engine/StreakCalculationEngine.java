package com.stiq.habittracker.engine;

import com.stiq.habittracker.entity.*;
import com.stiq.habittracker.repository.*;
import com.stiq.habittracker.service.DaySummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class StreakCalculationEngine {

    private final StreakStateRepository streakStateRepository;
    private final DaySummaryRepository daySummaryRepository;
    private final StreakFreezeWalletRepository freezeWalletRepository;
    private final FreezeEngine freezeEngine;
    private final DaySummaryService daySummaryService;

    /**
     * Core streak evaluation for a day
     */
    public void processDay(User user, DaySummary daySummary) {

        LocalDate date = daySummary.getDate();

        // Load or init streak state
        StreakState streakState = streakStateRepository
                .findByUser(user)
                .orElseGet(() -> initializeStreak(user));

        boolean successDay = daySummary.getIsSuccessDay();
        boolean freezeUsed = false;

        int currentStreak = streakState.getCurrentOverallStreak();

        // ---------------- LOGIC ----------------

        if (successDay) {
            // normal success
            currentStreak = currentStreak + 1;

        } else {
            // failure day
            boolean hasFreeze = freezeWalletRepository
                    .findByUser(user)
                    .map(w -> w.getAvailableFreezes() > 0)
                    .orElse(false);

            if (hasFreeze) {
                // auto-consume freeze
                freezeEngine.useFreeze(user, "AUTO_PROTECT_" + date);
                freezeUsed = true;

            } else {
                // streak break
                currentStreak = 0;
            }
        }

        // ---------------- STATE UPDATE ----------------

        streakState.setCurrentOverallStreak(currentStreak);

        if (currentStreak > streakState.getLongestOverallStreak()) {
            streakState.setLongestOverallStreak(currentStreak);
        }

        if (successDay || freezeUsed) {
            streakState.setLastSuccessDate(date);
        }

        streakStateRepository.save(streakState);

        // ---------------- DAY SUMMARY UPDATE ----------------

        daySummary.setFreezeUsed(freezeUsed);
        daySummary.setOverallStreakAfterDay(currentStreak);
        daySummaryRepository.save(daySummary);

        // ---------------- MILESTONE FREEZE REWARD ----------------

        // trigger freeze reward logic
        freezeEngine.evaluateMilestoneReward(user, currentStreak);
    }

    // ---------------- INIT ----------------

    private StreakState initializeStreak(User user) {
        StreakState streak = new StreakState();
        streak.setUser(user);
        streak.setCurrentOverallStreak(0);
        streak.setLongestOverallStreak(0);
        streak.setLastSuccessDate(null);
        return streakStateRepository.save(streak);
    }

//    public DaySummary buildDaySummary(User user, LocalDate date) {
//        DaySummary summary = new DaySummary();
//        summary.setUser(user);
//        summary.setDate(date);
//        summary.setActiveHabits(0);
//        summary.setSuccessRatio(0.0);
//        summary.setIsSuccessDay(false);
//        summary.setOverallStreakAfterDay(0);
//        summary.setFreezeUsed(false);
//        return summary;
//    }

    public DaySummary buildDaySummary(User user, LocalDate date) {
        return daySummaryService.buildDaySummary(user, date);
    }

}
