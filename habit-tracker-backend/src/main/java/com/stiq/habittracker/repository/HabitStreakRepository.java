package com.stiq.habittracker.repository;

import com.stiq.habittracker.entity.Habit;
import com.stiq.habittracker.entity.HabitStreak;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface HabitStreakRepository extends JpaRepository<HabitStreak, UUID> {

    Optional<HabitStreak> findByHabit(Habit habit);
}
