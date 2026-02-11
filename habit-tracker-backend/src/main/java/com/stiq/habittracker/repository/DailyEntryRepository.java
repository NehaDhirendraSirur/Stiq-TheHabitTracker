package com.stiq.habittracker.repository;

import com.stiq.habittracker.entity.DailyEntry;
import com.stiq.habittracker.entity.Habit;
import com.stiq.habittracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DailyEntryRepository extends JpaRepository<DailyEntry, UUID> {

    List<DailyEntry> findByUserAndDate(User user, LocalDate date);

    Optional<DailyEntry> findByUserAndHabitAndDate(User user, Habit habit, LocalDate date);

    List<DailyEntry> findByHabit(Habit habit);

    List<DailyEntry> findByUserAndDateBetween(User user, LocalDate start, LocalDate end);
}
