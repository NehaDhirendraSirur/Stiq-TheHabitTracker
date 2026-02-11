package com.stiq.habittracker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

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

    @Column(name = "completed_habits", nullable = false)
    private Integer completedHabits;

    @Column(name = "active_habits", nullable = false)
    private Integer activeHabits;

    @Column(name = "success_ratio", nullable = false)
    private Double successRatio;

    @Column(name = "is_success_day", nullable = false)
    private Boolean isSuccessDay;

    @Column(name = "overall_streak_after_day", nullable = false)
    private Integer overallStreakAfterDay;
}
