package com.stiq.habittracker.repository;

import com.stiq.habittracker.entity.StreakState;
import com.stiq.habittracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface StreakStateRepository extends JpaRepository<StreakState, UUID> {

    Optional<StreakState> findByUser(User user);
}

