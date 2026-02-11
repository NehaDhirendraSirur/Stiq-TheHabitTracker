package com.stiq.habittracker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "habit_streak")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class HabitStreak {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "habit_streak_id")
    private UUID habitStreakId;

    @OneToOne
    @JoinColumn(name = "habit_id", nullable = false, unique = true)
    private Habit habit;

    @Column(name = "current_streak", nullable = false)
    private Integer currentStreak;

    @Column(name = "longest_streak", nullable = false)
    private Integer longestStreak;

    @Column(name = "last_completed_date")
    private LocalDate lastCompletedDate;
}
