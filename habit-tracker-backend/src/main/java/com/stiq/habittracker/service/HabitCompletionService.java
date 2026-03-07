package com.stiq.habittracker.service;

import com.stiq.habittracker.dto.request.CompleteHabitRequest;
import com.stiq.habittracker.dto.request.FailHabitRequest;
import com.stiq.habittracker.dto.response.DaySummaryResponse;
import com.stiq.habittracker.entity.*;
import com.stiq.habittracker.engine.*;
import com.stiq.habittracker.exception.HabitAlreadyCompletedException;
import com.stiq.habittracker.exception.ResourceNotFoundException;
import com.stiq.habittracker.mapper.DailyEntryMapper;
import com.stiq.habittracker.repository.DailyEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import com.stiq.habittracker.dto.response.DailyEntryResponse;

@Service
@RequiredArgsConstructor
public class HabitCompletionService {

    private final DailyEntryRepository dailyEntryRepository;
    private final HabitService habitService;
    private final UserService userService;
    private final DaySummaryService daySummaryService;
    private final StreakEngine streakEngine;
    private final PointsEngine pointsEngine;
    private final FreezeEngine freezeEngine;
    private final DailyEntryMapper dailyEntryMapper;

    @Transactional
    public DaySummaryResponse completeHabit(CompleteHabitRequest request) {
        User user = userService.getCurrentUser();
        Habit habit = habitService.getHabitEntityById(request.getHabitId());
        validateHabitOwnership(user, habit);
        validateNotAlreadyCompleted(user, habit, request.getDate());
        DailyEntry entry = new DailyEntry();
        entry.setUser(user);
        entry.setHabit(habit);
        entry.setDate(request.getDate());
        entry.setIsCompleted(true);
        dailyEntryRepository.save(entry);
        DaySummary summary = daySummaryService.buildDaySummary(user, request.getDate());
        streakEngine.processDayResult(user, summary);
        pointsEngine.processPoints(user, summary);
        return daySummaryService.toResponse(summary);
    }

    @Transactional
    public DaySummaryResponse failHabit(FailHabitRequest request) {
        User user = userService.getCurrentUser();
        Habit habit = habitService.getHabitEntityById(request.getHabitId());
        validateHabitOwnership(user, habit);
        validateNotAlreadyLogged(user, habit, request.getDate());
        DailyEntry entry = new DailyEntry();
        entry.setUser(user);
        entry.setHabit(habit);
        entry.setDate(request.getDate());
        entry.setIsCompleted(false);
        dailyEntryRepository.save(entry);
        DaySummary summary = daySummaryService.buildDaySummary(user, request.getDate());
        if (request.isUseFreeze()) {
            summary.setFreezeUsed(true);
            freezeEngine.useFreeze(user, "MANUAL_" + request.getDate());
        }
        streakEngine.processDayResult(user, summary);
        pointsEngine.processPoints(user, summary);
        return daySummaryService.toResponse(summary);
    }

    public List<DailyEntryResponse> getEntriesForDate(LocalDate date) {
        User user = userService.getCurrentUser();
        return dailyEntryRepository.findByUserAndDate(user, date)
                .stream().map(dailyEntryMapper::toResponse).toList();
    }

    public List<DailyEntryResponse> getEntriesForHabit(UUID habitId) {
        Habit habit = habitService.getHabitEntityById(habitId);
        return dailyEntryRepository.findByHabit(habit)
                .stream().map(dailyEntryMapper::toResponse).toList();
    }

    private void validateHabitOwnership(User user, Habit habit) {
        if (!habit.getUser().getUserId().equals(user.getUserId())) {
            throw new ResourceNotFoundException("Habit not found: " + habit.getHabitId());
        }
    }

    private void validateNotAlreadyCompleted(User user, Habit habit, LocalDate date) {
        dailyEntryRepository.findByUserAndHabitAndDate(user, habit, date)
                .ifPresent(entry -> {
                    if (Boolean.TRUE.equals(entry.getIsCompleted())) {
                        throw new HabitAlreadyCompletedException(
                                "Habit already completed for date: " + date);
                    }
                });
    }

    private void validateNotAlreadyLogged(User user, Habit habit, LocalDate date) {
        dailyEntryRepository.findByUserAndHabitAndDate(user, habit, date)
                .ifPresent(entry -> {
                    throw new HabitAlreadyCompletedException(
                            "Habit already logged for date: " + date);
                });
    }
}