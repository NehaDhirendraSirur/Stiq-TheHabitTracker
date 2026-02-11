package com.stiq.habittracker.repository;

import com.stiq.habittracker.entity.Habit;
import com.stiq.habittracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface HabitRepository extends JpaRepository<Habit, UUID> {

    List<Habit> findByUser(User user);

    List<Habit> findByUserAndIsActiveTrue(User user);
}
