package com.stiq.habittracker.repository;

import com.stiq.habittracker.entity.StreakFreezeWallet;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import com.stiq.habittracker.entity.User;

import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;

public interface StreakFreezeWalletRepository
        extends JpaRepository<StreakFreezeWallet, UUID> {

    // Correct derived queries
    Optional<StreakFreezeWallet> findByUser(User user);
    boolean existsByUser(User user);

    // Correct JPQL — join through relationship
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT w FROM StreakFreezeWallet w WHERE w.user.userId = :userId")
    Optional<StreakFreezeWallet> findByUserIdForUpdate(@Param("userId") UUID userId);

    @Modifying
    @Query("""
    UPDATE StreakFreezeWallet w
    SET w.availableFreezes = w.availableFreezes + :count,
        w.totalEarned = w.totalEarned + :count
    WHERE w.user.userId = :userId
""")
    void rewardFreeze(@Param("userId") UUID userId, @Param("count") int count);

    @Modifying
    @Query("""
    UPDATE StreakFreezeWallet w
    SET w.availableFreezes = w.availableFreezes - 1,
        w.totalUsed = w.totalUsed + 1
    WHERE w.user.userId = :userId
      AND w.availableFreezes > 0
""")
    int consumeFreeze(@Param("userId") UUID userId);
}
