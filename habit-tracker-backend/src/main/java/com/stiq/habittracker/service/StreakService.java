package com.stiq.habittracker.service;

import com.stiq.habittracker.dto.response.HabitStreakResponse;
import com.stiq.habittracker.dto.response.StreakStateResponse;
import com.stiq.habittracker.entity.*;
import com.stiq.habittracker.exception.ResourceNotFoundException;
import com.stiq.habittracker.mapper.StreakMapper;
import com.stiq.habittracker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

// StreakService.java — updated
@Service
@RequiredArgsConstructor
public class StreakService {

    private final StreakStateRepository streakStateRepository;
    private final HabitStreakRepository habitStreakRepository;
    private final HabitRepository habitRepository;
    private final UserService userService;
    private final StreakMapper streakMapper;

    public StreakStateResponse getOverallStreak() {
        User user = userService.getCurrentUser();
        StreakState streakState = streakStateRepository
                .findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Streak state not found for user: " + user.getUserId()));
        return streakMapper.toStreakStateResponse(streakState);
    }

    public List<HabitStreakResponse> getAllHabitStreaks() {
        User user = userService.getCurrentUser();
        return habitRepository.findByUserAndIsActiveTrue(user)
                .stream()
                .map(habit -> habitStreakRepository
                        .findByHabit(habit)
                        .map(streak -> streakMapper.toHabitStreakResponse(habit, streak))
                        .orElse(streakMapper.toEmptyHabitStreakResponse(habit))
                )
                .toList();
    }

    public HabitStreakResponse getHabitStreak(UUID habitId) {
        User user = userService.getCurrentUser();
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found: " + habitId));
        if (!habit.getUser().getUserId().equals(user.getUserId())) {
            throw new ResourceNotFoundException("Habit not found: " + habitId);
        }
        return habitStreakRepository
                .findByHabit(habit)
                .map(streak -> streakMapper.toHabitStreakResponse(habit, streak))
                .orElse(streakMapper.toEmptyHabitStreakResponse(habit));
    }
}