package com.stiq.habittracker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "streak_state")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class StreakState {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "streak_id")
    private UUID streakId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "current_overall_streak", nullable = false)
    @Builder.Default
    private Integer currentOverallStreak=0;

    @Column(name = "longest_overall_streak", nullable = false)
    @Builder.Default
    private Integer longestOverallStreak=0;

    @Column(name = "last_success_date")
    private LocalDate lastSuccessDate;
}
