package com.stiq.habittracker.service;

import com.stiq.habittracker.dto.response.DaySummaryResponse;
import com.stiq.habittracker.entity.*;
import com.stiq.habittracker.exception.ResourceNotFoundException;
import com.stiq.habittracker.mapper.DaySummaryMapper;
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
    private final DaySummaryMapper daySummaryMapper;

    @Transactional
    public DaySummary buildDaySummary(User user, LocalDate date) {
        List<Habit> activeHabits = habitRepository.findByUserAndIsActiveTrue(user);
        int activeHabitsCount = activeHabits.size();
        List<DailyEntry> entries = dailyEntryRepository.findByUserAndDate(user, date);
        Set<UUID> completedHabits = entries.stream()
                .filter(e -> Boolean.TRUE.equals(e.getIsCompleted()))
                .map(e -> e.getHabit().getHabitId())
                .collect(Collectors.toSet());
        Set<UUID> failedHabits = entries.stream()
                .filter(e -> Boolean.FALSE.equals(e.getIsCompleted()))
                .map(e -> e.getHabit().getHabitId())
                .collect(Collectors.toSet());
        double successRatio = activeHabitsCount == 0 ? 0.0 :
                (double) completedHabits.size() / activeHabitsCount;
        boolean isSuccessDay = activeHabitsCount > 0
                && completedHabits.size() == activeHabitsCount;
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
        summary.setOverallStreakAfterDay(0);
        summary.setFreezeUsed(false);
        return daySummaryRepository.save(summary);
    }

    public DaySummaryResponse getToday() {
        User user = userService.getCurrentUser();
        LocalDate today = LocalDate.now();
        DaySummary summary = daySummaryRepository
                .findByUserAndDate(user, today)
                .orElseGet(() -> buildDaySummary(user, today));
        return daySummaryMapper.toResponse(summary);
    }

    public DaySummaryResponse getByDate(LocalDate date) {
        User user = userService.getCurrentUser();
        DaySummary summary = daySummaryRepository
                .findByUserAndDate(user, date)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No summary found for date: " + date));
        return daySummaryMapper.toResponse(summary);
    }

    public List<DaySummaryResponse> getRange(LocalDate start, LocalDate end) {
        User user = userService.getCurrentUser();
        return daySummaryRepository
                .findByUserAndDateBetween(user, start, end)
                .stream().map(daySummaryMapper::toResponse).toList();
    }

    public DaySummaryResponse toResponse(DaySummary summary) {
        return daySummaryMapper.toResponse(summary);
    }
}