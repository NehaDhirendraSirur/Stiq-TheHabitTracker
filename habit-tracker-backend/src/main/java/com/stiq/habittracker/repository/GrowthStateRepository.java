package com.stiq.habittracker.repository;

import com.stiq.habittracker.entity.GrowthState;
import com.stiq.habittracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface GrowthStateRepository extends JpaRepository<GrowthState, UUID> {

    Optional<GrowthState> findByUser(User user);
}
