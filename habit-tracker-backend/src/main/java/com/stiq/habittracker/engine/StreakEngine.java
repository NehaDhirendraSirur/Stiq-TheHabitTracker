package com.stiq.habittracker.engine;

import com.stiq.habittracker.entity.*;
import com.stiq.habittracker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class StreakEngine {

    private final HabitStreakRepository habitStreakRepository;
    private final StreakCalculationEngine streakCalculationEngine;
    private final HabitRepository habitRepository;

    public void processDayResult(User user, DaySummary summary) {
        streakCalculationEngine.processDay(user, summary);
        processHabitStreaks(summary);
    }

    // -------------------- Habit Streak Logic --------------------

    private void processHabitStreaks(DaySummary summary) {
        LocalDate date = summary.getDate();

        if (Boolean.TRUE.equals(summary.getIsSuccessDay())) {
            summary.getCompletedHabits().forEach(habitId -> processHabitSuccess(habitId, date));
        } else {
            summary.getFailedHabits().forEach(this::processHabitFailure);
        }
    }

    private void processHabitSuccess(UUID habitId, LocalDate date) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new IllegalStateException("Habit not found: " + habitId));

        HabitStreak habitStreak = habitStreakRepository
                .findByHabit(habit)
                .orElseGet(() -> initializeHabitStreak(habit));

        int newStreak = habitStreak.getCurrentStreak() + 1;
        habitStreak.setCurrentStreak(newStreak);

        if (newStreak > habitStreak.getLongestStreak()) {
            habitStreak.setLongestStreak(newStreak);
        }

        habitStreak.setLastCompletedDate(date);
        habitStreakRepository.save(habitStreak);
    }

    private void processHabitFailure(UUID habitId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new IllegalStateException("Habit not found: " + habitId));

        HabitStreak habitStreak = habitStreakRepository
                .findByHabit(habit)
                .orElseGet(() -> initializeHabitStreak(habit));

        habitStreak.setCurrentStreak(0);
        habitStreakRepository.save(habitStreak);
    }

    // -------------------- Init --------------------

    private HabitStreak initializeHabitStreak(Habit habit) {
        HabitStreak hs = new HabitStreak();
        hs.setHabit(habit);
        hs.setCurrentStreak(0);
        hs.setLongestStreak(0);
        hs.setLastCompletedDate(null);
        return habitStreakRepository.save(hs);
    }
}