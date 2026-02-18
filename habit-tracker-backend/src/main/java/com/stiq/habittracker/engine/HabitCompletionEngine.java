package com.stiq.habittracker.engine;

import com.stiq.habittracker.entity.*;
import com.stiq.habittracker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class HabitCompletionEngine {

    private final DailyEntryRepository dailyEntryRepository;
    private final HabitRepository habitRepository;
    private final DaySummaryRepository daySummaryRepository;

    private final StreakEngine streakEngine;
    private final StreakCalculationEngine streakCalculationEngine;
    private final PointsEngine pointsEngine;
    private final FreezeEngine freezeEngine;

    /**
     * Core action:
     * User marks a habit as completed for a day
     */
    public void completeHabit(User user, Habit habit, LocalDate date) {

        // 1. Save daily entry
        DailyEntry entry = new DailyEntry();
        entry.setUser(user);
        entry.setHabit(habit);
        entry.setDate(date);
        entry.setIsCompleted(true);

        dailyEntryRepository.save(entry);

        // 2. Recalculate day summary
        DaySummary summary = streakCalculationEngine.buildDaySummary(user, date);

        daySummaryRepository.save(summary);

        // 3. Apply streak logic
        streakEngine.processDayResult(user, summary);

        // 4. Award points
        pointsEngine.processPoints(user, summary);

        // 5. Freeze logic handled inside streak engine → freeze engine
    }

    /**
     * User explicitly skips / fails habit for a day
     */
    public void failHabit(User user, Habit habit, LocalDate date, boolean useFreeze) {

        // 1. Save daily entry
        DailyEntry entry = new DailyEntry();
        entry.setUser(user);
        entry.setHabit(habit);
        entry.setDate(date);
        entry.setIsCompleted(false);

        dailyEntryRepository.save(entry);

        // 2. Build day summary
        DaySummary summary = streakCalculationEngine.buildDaySummary(user, date);

        if (useFreeze) {
            summary.setFreezeUsed(true);
            freezeEngine.useFreeze(user, "manual_freeze");
        }

        daySummaryRepository.save(summary);

        // 3. Process streak
        streakEngine.processDayResult(user, summary);

        // 4. Points (likely zero / penalty)
        pointsEngine.processPoints(user, summary);
    }
}
