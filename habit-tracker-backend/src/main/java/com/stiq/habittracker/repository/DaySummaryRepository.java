package com.stiq.habittracker.repository;

import com.stiq.habittracker.entity.DaySummary;
import com.stiq.habittracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DaySummaryRepository extends JpaRepository<DaySummary, UUID> {

    Optional<DaySummary> findByUserAndDate(User user, LocalDate date);

    List<DaySummary> findByUserAndDateBetween(User user, LocalDate start, LocalDate end);
}
