package com.stiq.habittracker.repository;


import com.stiq.habittracker.entity.StreakFreezeLedger;
import com.stiq.habittracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;


public interface StreakFreezeLedgerRepository extends JpaRepository<StreakFreezeLedger, UUID> {
    List<StreakFreezeLedger> findByUser(User user);

    boolean existsByUserAndSourceRef(User user, String sourceRef);
}