package com.stiq.habittracker.service;

import com.stiq.habittracker.dto.response.DaySummaryResponse;
import com.stiq.habittracker.entity.*;
import com.stiq.habittracker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DaySummaryService {

    private final DaySummaryRepository daySummaryRepository;
    private final DailyEntryRepository dailyEntryRepository;
    private final HabitRepository habitRepository;
    private final UserService userService;

    // -------------------- Build --------------------

    /**
     * Replaces the stub in StreakCalculationEngine.
     * Queries real data to build an accurate DaySummary.
     */
    @Transactional
    public DaySummary buildDaySummary(User user, LocalDate date) {

        // 1. Get all active habits for user
        List<Habit> activeHabits = habitRepository.findByUserAndIsActiveTrue(user);
        int activeHabitsCount = activeHabits.size();

        // 2. Get all daily entries for this user on this date
        List<DailyEntry> entries = dailyEntryRepository.findByUserAndDate(user, date);

        // 3. Compute completed and failed habit ID sets
        Set<UUID> completedHabits = entries.stream()
                .filter(e -> Boolean.TRUE.equals(e.getIsCompleted()))
                .map(e -> e.getHabit().getHabitId())
                .collect(Collectors.toSet());

        Set<UUID> failedHabits = entries.stream()
                .filter(e -> Boolean.FALSE.equals(e.getIsCompleted()))
                .map(e -> e.getHabit().getHabitId())
                .collect(Collectors.toSet());

        // 4. Compute success ratio
        double successRatio = activeHabitsCount == 0 ? 0.0 :
                (double) completedHabits.size() / activeHabitsCount;

        // 5. Success day = all active habits completed
        boolean isSuccessDay = activeHabitsCount > 0
                && completedHabits.size() == activeHabitsCount;

        // 6. Check if existing summary exists — update it, don't duplicate
        DaySummary summary = daySummaryRepository
                .findByUserAndDate(user, date)
                .orElse(new DaySummary());

        summary.setUser(user);
        summary.setDate(date);
        summary.setActiveHabits(activeHabitsCount);
        summary.setSuccessRatio(successRatio);
        summary.setIsSuccessDay(isSuccessDay);
        summary.setCompletedHabits(completedHabits);
        summary.setFailedHabits(failedHabits);
        summary.setOverallStreakAfterDay(0); // updated by StreakCalculationEngine after
        summary.setFreezeUsed(false);        // updated by StreakCalculationEngine after

        return daySummaryRepository.save(summary);
    }

    // -------------------- Fetch --------------------

    public DaySummaryResponse getToday() {
        User user = userService.getCurrentUser();
        LocalDate today = LocalDate.now();

        DaySummary summary = daySummaryRepository
                .findByUserAndDate(user, today)
                .orElseGet(() -> buildDaySummary(user, today));

        return toResponse(summary);
    }

    public DaySummaryResponse getByDate(LocalDate date) {
        User user = userService.getCurrentUser();

        DaySummary summary = daySummaryRepository
                .findByUserAndDate(user, date)
                .orElseThrow(() -> new com.stiq.habittracker.exception
                        .ResourceNotFoundException("No summary found for date: " + date));

        return toResponse(summary);
    }

    public List<DaySummaryResponse> getRange(LocalDate start, LocalDate end) {
        User user = userService.getCurrentUser();

        return daySummaryRepository
                .findByUserAndDateBetween(user, start, end)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // -------------------- Mapper --------------------

    public DaySummaryResponse toResponse(DaySummary summary) {
        return DaySummaryResponse.builder()
                .dayId(summary.getDayId())
                .date(summary.getDate())
                .activeHabits(summary.getActiveHabits())
                .completedHabitsCount(
                        summary.getCompletedHabits() != null
                                ? summary.getCompletedHabits().size()
                                : 0
                )
                .successRatio(summary.getSuccessRatio())
                .isSuccessDay(summary.getIsSuccessDay())
                .freezeUsed(summary.getFreezeUsed())
                .overallStreakAfterDay(summary.getOverallStreakAfterDay())
                .completedHabits(summary.getCompletedHabits())
                .failedHabits(summary.getFailedHabits())
                .build();
    }
}