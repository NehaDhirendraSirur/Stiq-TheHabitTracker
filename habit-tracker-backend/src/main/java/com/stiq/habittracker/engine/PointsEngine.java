package com.stiq.habittracker.engine;

import com.stiq.habittracker.entity.*;
import com.stiq.habittracker.enums.GrowthTheme;
import com.stiq.habittracker.enums.PointsSource;
import com.stiq.habittracker.repository.GrowthStateRepository;
import com.stiq.habittracker.repository.PointsLedgerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class PointsEngine {

    private final PointsLedgerRepository pointsLedgerRepository;
    private final GrowthStateRepository growthStateRepository;

    // ---------------- CONFIG ----------------
    private static final int HABIT_SUCCESS_POINTS = 10;
    private static final int DAY_SUCCESS_POINTS = 20;
    private static final int STREAK_MILESTONE_POINTS = 50;

    // ---------------- PUBLIC APIs ----------------

    /**
     * Habit completion reward
     */
    public void rewardHabit(User user, UUID habitId) {
        createPoints(user, PointsSource.HABIT, habitId, HABIT_SUCCESS_POINTS);
    }

    /**
     * Successful day reward
     */
    public void rewardDay(User user, UUID daySummaryId) {
        createPoints(user, PointsSource.DAY, daySummaryId, DAY_SUCCESS_POINTS);
    }

    /**
     * Streak milestone reward
     * Example: 10, 20, 30 days
     */
    public void rewardStreakMilestone(User user, int streakCount) {

        if (streakCount <= 0) return;
        if (streakCount % 10 != 0) return;   // 10,20,30,...

        UUID ref = UUID.nameUUIDFromBytes(("STREAK_" + streakCount).getBytes());

        boolean alreadyGiven = pointsLedgerRepository
                .existsByUser_UserIdAndSourceRefId(user.getUserId(), ref);

        if (alreadyGiven) return;

        createPoints(user, PointsSource.STREAK, ref, STREAK_MILESTONE_POINTS);
    }

    // ---------------- CORE ----------------

    private void createPoints(User user, PointsSource source, UUID refId, int points) {

        PointsLedger ledger = PointsLedger.builder()
                .user(user)
                .source(source)
                .sourceRefId(refId)
                .points(points)
                .build();

        pointsLedgerRepository.save(ledger);

        // update growth cache
        GrowthState growth = growthStateRepository
                .findByUser(user)
                .orElseGet(() -> initializeGrowth(user));

        growth.setTotalPoints(growth.getTotalPoints() + points);
        growth.setLastUpdated(LocalDateTime.now());

        growthStateRepository.save(growth);
    }

    // ---------------- ORCHESTRATION ----------------

    /**
     * Called once per day after DaySummary creation
     */
    public void processPoints(User user, DaySummary summary) {

        // 1. Habit rewards
        if (summary.getCompletedHabits() != null) {
            summary.getCompletedHabits()
                    .forEach(habitId  ->
                            rewardHabit(user, habitId)
                    );
        }

        // 2. Successful day reward
        if (Boolean.TRUE.equals(summary.getIsSuccessDay())) {
            rewardDay(user, summary.getDayId());
        }

        // 3. Streak milestone reward
        rewardStreakMilestone(user, summary.getOverallStreakAfterDay());
    }

    // ---------------- INIT ----------------

    private GrowthState initializeGrowth(User user) {
        GrowthState g = new GrowthState();
        g.setUser(user);
        g.setTheme(GrowthTheme.NATURE);
        g.setLevel(1);
        g.setTotalPoints(0);
        g.setVisualStage(1);
        g.setCustomName("Seed");
        g.setLastUpdated(LocalDateTime.now());
        return growthStateRepository.save(g);
    }
}
