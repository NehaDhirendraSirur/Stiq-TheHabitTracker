package com.stiq.habittracker.service;

import com.stiq.habittracker.dto.response.HabitStreakResponse;
import com.stiq.habittracker.dto.response.StreakStateResponse;
import com.stiq.habittracker.entity.*;
import com.stiq.habittracker.exception.ResourceNotFoundException;
import com.stiq.habittracker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StreakService {

    private final StreakStateRepository streakStateRepository;
    private final HabitStreakRepository habitStreakRepository;
    private final HabitRepository habitRepository;
    private final UserService userService;

    // -------------------- Overall Streak --------------------

    public StreakStateResponse getOverallStreak() {
        User user = userService.getCurrentUser();

        StreakState streakState = streakStateRepository
                .findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Streak state not found for user: " + user.getUserId()
                ));

        return toStreakStateResponse(streakState);
    }

    // -------------------- Habit Streaks --------------------

    public List<HabitStreakResponse> getAllHabitStreaks() {
        User user = userService.getCurrentUser();

        return habitRepository.findByUserAndIsActiveTrue(user)
                .stream()
                .map(habit -> habitStreakRepository
                        .findByHabit(habit)
                        .map(streak -> toHabitStreakResponse(habit, streak))
                        .orElse(emptyHabitStreakResponse(habit))
                )
                .toList();
    }

    public HabitStreakResponse getHabitStreak(java.util.UUID habitId) {
        User user = userService.getCurrentUser();

        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Habit not found: " + habitId
                ));

        if (!habit.getUser().getUserId().equals(user.getUserId())) {
            throw new ResourceNotFoundException("Habit not found: " + habitId);
        }

        return habitStreakRepository
                .findByHabit(habit)
                .map(streak -> toHabitStreakResponse(habit, streak))
                .orElse(emptyHabitStreakResponse(habit));
    }

    // -------------------- Mappers --------------------

    private StreakStateResponse toStreakStateResponse(StreakState state) {
        return StreakStateResponse.builder()
                .currentOverallStreak(state.getCurrentOverallStreak())
                .longestOverallStreak(state.getLongestOverallStreak())
                .lastSuccessDate(state.getLastSuccessDate())
                .build();
    }

    private HabitStreakResponse toHabitStreakResponse(Habit habit, HabitStreak streak) {
        return HabitStreakResponse.builder()
                .habitId(habit.getHabitId())
                .habitName(habit.getName())
                .currentStreak(streak.getCurrentStreak())
                .longestStreak(streak.getLongestStreak())
                .lastCompletedDate(streak.getLastCompletedDate())
                .build();
    }

    private HabitStreakResponse emptyHabitStreakResponse(Habit habit) {
        return HabitStreakResponse.builder()
                .habitId(habit.getHabitId())
                .habitName(habit.getName())
                .currentStreak(0)
                .longestStreak(0)
                .lastCompletedDate(null)
                .build();
    }
}