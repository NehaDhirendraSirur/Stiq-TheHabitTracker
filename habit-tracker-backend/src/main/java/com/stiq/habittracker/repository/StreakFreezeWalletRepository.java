package com.stiq.habittracker.repository;


import com.stiq.habittracker.entity.StreakFreezeWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;


public interface StreakFreezeWalletRepository extends JpaRepository<StreakFreezeWallet, UUID> {
    Optional<StreakFreezeWallet> findByUserId(UUID userId);
}