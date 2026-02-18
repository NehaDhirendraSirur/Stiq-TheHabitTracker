package com.stiq.habittracker.engine;

import com.stiq.habittracker.entity.GrowthState;
import com.stiq.habittracker.entity.PointsLedger;
import com.stiq.habittracker.entity.User;
import com.stiq.habittracker.enums.GrowthTheme;
import com.stiq.habittracker.repository.GrowthStateRepository;
import com.stiq.habittracker.repository.PointsLedgerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class GrowthEngine {

    private final GrowthStateRepository growthStateRepository;
    private final PointsLedgerRepository pointsLedgerRepository;

    /**
     * Sync growth state with total points
     */
    public void syncGrowth(User user) {

        GrowthState growth = growthStateRepository
                .findByUser(user)
                .orElseGet(() -> initializeGrowth(user));

        // Sum points
        List<PointsLedger> ledgers = pointsLedgerRepository.findByUser(user);
        int totalPoints = ledgers.stream().mapToInt(PointsLedger::getPoints).sum();

        growth.setTotalPoints(totalPoints);

        // Level logic (simple deterministic model)
        int level = calculateLevel(totalPoints);
        growth.setLevel(level);

        // Visual stage logic
        int visualStage = calculateVisualStage(level);
        growth.setVisualStage(visualStage);

        growth.setLastUpdated(LocalDateTime.now());

        growthStateRepository.save(growth);
    }

    // ---------------- Internal Logic ----------------

    private int calculateLevel(int points) {
        // Example: every 100 points = 1 level
        return Math.max(1, points / 100);
    }

    private int calculateVisualStage(int level) {
        // Example: every 3 levels = 1 stage
        return Math.max(1, level / 3);
    }

    private GrowthState initializeGrowth(User user) {
        GrowthState growth = new GrowthState();
        growth.setUser(user);
        growth.setTheme(GrowthTheme.TREE);
        growth.setLevel(1);
        growth.setTotalPoints(0);
        growth.setVisualStage(1);
        growth.setCustomName("Seed");
        growth.setLastUpdated(LocalDateTime.now());
        return growthStateRepository.save(growth);
    }
}
