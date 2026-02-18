package com.stiq.habittracker.engine;

import com.stiq.habittracker.entity.*;
import com.stiq.habittracker.enums.FreezeSource;
import com.stiq.habittracker.enums.FreezeType;
import com.stiq.habittracker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class FreezeEngine {

    private final StreakFreezeWalletRepository walletRepository;
    private final StreakFreezeLedgerRepository ledgerRepository;
    private final PointsLedgerRepository pointsLedgerRepository;

    // ------------------- Public APIs -------------------

    /**
     * Called after streak update
     * Evaluates milestone rewards
     */
    public void evaluateMilestoneReward(User user, int currentOverallStreak) {

        if (user == null) return;
        if (currentOverallStreak <= 0) return;

        // milestones: 10, 20, 30, 40...
        if (currentOverallStreak % 10 != 0) return;

        String milestoneRef = currentOverallStreak + "_day_streak";

        // Convert milestone to UUID reference
        UUID milestoneUUID = UUID.nameUUIDFromBytes(milestoneRef.getBytes());

        // Prevent duplicate rewards
        boolean alreadyRewarded = ledgerRepository
                .existsByUserAndSourceRef(user, milestoneRef);

        if (alreadyRewarded) return;

        earnFreeze(user, FreezeSource.MILESTONE, milestoneRef);
    }

    /**
     * Earn freeze (wallet + ledger)
     */
    public void earnFreeze(User user, FreezeSource source, String sourceRef) {

        StreakFreezeWallet wallet = walletRepository
                .findByUser(user)
                .orElseGet(() -> initializeWallet(user)); // pass user not userId

        wallet.setTotalEarned(wallet.getTotalEarned() + 1);
        wallet.setAvailableFreezes(wallet.getAvailableFreezes() + 1);

        walletRepository.save(wallet);

        StreakFreezeLedger ledger = new StreakFreezeLedger();
        ledger.setUser(user);
        ledger.setType(FreezeType.EARNED);
        ledger.setSource(source);
        ledger.setSourceRef(sourceRef);
        ledger.setDate(LocalDate.now());

        ledgerRepository.save(ledger);
    }

    /**
     * Consume freeze
     */
    public void useFreeze(User user, String sourceRef) {

        StreakFreezeWallet wallet = walletRepository
                .findByUser(user)
                .orElseThrow(() -> new IllegalStateException("Freeze wallet not found"));

        if (wallet.getAvailableFreezes() <= 0) {
            throw new IllegalStateException("No freeze available");
        }

        wallet.setTotalUsed(wallet.getTotalUsed() + 1);
        wallet.setAvailableFreezes(wallet.getAvailableFreezes() - 1);

        walletRepository.save(wallet);

        StreakFreezeLedger ledger = new StreakFreezeLedger();
        ledger.setUser(user);
        ledger.setType(FreezeType.USED);
        ledger.setSource(FreezeSource.AUTO);
        ledger.setSourceRef(sourceRef);
        ledger.setDate(LocalDate.now());

        ledgerRepository.save(ledger);
    }

    // ------------------- Initializer -------------------

    private StreakFreezeWallet initializeWallet(User user) {
        StreakFreezeWallet wallet = new StreakFreezeWallet();
        wallet.setUser(user);
        wallet.setTotalEarned(0);
        wallet.setTotalUsed(0);
        wallet.setAvailableFreezes(0);
        return walletRepository.save(wallet);
    }
}
