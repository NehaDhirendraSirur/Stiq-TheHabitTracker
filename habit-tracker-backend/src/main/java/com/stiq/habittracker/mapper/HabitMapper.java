package com.stiq.habittracker.mapper;

import com.stiq.habittracker.dto.response.HabitResponse;
import com.stiq.habittracker.entity.Habit;
import org.springframework.stereotype.Component;

@Component
public class HabitMapper {

    public HabitResponse toResponse(Habit habit) {
        return HabitResponse.builder()
                .habitId(habit.getHabitId())
                .name(habit.getName())
                .type(habit.getType())
                .dailyTarget(habit.getDailyTarget())
                .minThreshold(habit.getMinThreshold())
                .isActive(habit.getIsActive())
                .createdAt(habit.getCreatedAt())
                .build();
    }
}