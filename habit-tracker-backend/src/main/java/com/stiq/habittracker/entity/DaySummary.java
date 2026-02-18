package com.stiq.habittracker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "day_summary")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class DaySummary {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "day_id")
    private UUID dayId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    // ---------------- Metrics ----------------

    @Column(name = "active_habits", nullable = false)
    private Integer activeHabits;

    @Column(name = "success_ratio", nullable = false)
    private Double successRatio;

    @Column(name = "is_success_day", nullable = false)
    private Boolean isSuccessDay;

    @Column(name = "freeze_used", nullable = false)
    @Builder.Default
    private Boolean freezeUsed = false;

    @Column(name = "overall_streak_after_day", nullable = false)
    private Integer overallStreakAfterDay;

    // ---------------- State (CRITICAL) ----------------

    /** Habits successfully completed today */
    @ElementCollection
    @CollectionTable(
            name = "day_completed_habits",
            joinColumns = @JoinColumn(name = "day_id")
    )
    @Column(name = "habit_id")
    @Builder.Default
    private Set<UUID> completedHabits = new HashSet<>();

    /** Habits failed/skipped today */
    @ElementCollection
    @CollectionTable(
            name = "day_failed_habits",
            joinColumns = @JoinColumn(name = "day_id")
    )
    @Column(name = "habit_id")
    @Builder.Default
    private Set<UUID> failedHabits = new HashSet<>();
}