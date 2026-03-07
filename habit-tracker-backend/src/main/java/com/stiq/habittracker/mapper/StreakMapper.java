package com.stiq.habittracker.mapper;

import com.stiq.habittracker.dto.response.HabitStreakResponse;
import com.stiq.habittracker.dto.response.StreakStateResponse;
import com.stiq.habittracker.entity.Habit;
import com.stiq.habittracker.entity.HabitStreak;
import com.stiq.habittracker.entity.StreakState;
import org.springframework.stereotype.Component;

@Component
public class StreakMapper {

    public StreakStateResponse toStreakStateResponse(StreakState state) {
        return StreakStateResponse.builder()
                .currentOverallStreak(state.getCurrentOverallStreak())
                .longestOverallStreak(state.getLongestOverallStreak())
                .lastSuccessDate(state.getLastSuccessDate())
                .build();
    }

    public HabitStreakResponse toHabitStreakResponse(Habit habit, HabitStreak streak) {
        return HabitStreakResponse.builder()
                .habitId(habit.getHabitId())
                .habitName(habit.getName())
                .currentStreak(streak.getCurrentStreak())
                .longestStreak(streak.getLongestStreak())
                .lastCompletedDate(streak.getLastCompletedDate())
                .build();
    }

    public HabitStreakResponse toEmptyHabitStreakResponse(Habit habit) {
        return HabitStreakResponse.builder()
                .habitId(habit.getHabitId())
                .habitName(habit.getName())
                .currentStreak(0)
                .longestStreak(0)
                .lastCompletedDate(null)
                .build();
    }
}