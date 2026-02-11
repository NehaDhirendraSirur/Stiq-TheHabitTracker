package com.stiq.habittracker.repository;


import com.stiq.habittracker.entity.StreakFreezeLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;


public interface StreakFreezeLedgerRepository extends JpaRepository<StreakFreezeLedger, UUID> {
    List<StreakFreezeLedger> findByUserId(UUID userId);
}