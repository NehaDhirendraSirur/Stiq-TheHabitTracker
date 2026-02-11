package com.stiq.habittracker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(
        name = "users",
        indexes = {
                @Index(name = "idx_user_email", columnList = "email", unique = true)
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue
    @Column(name = "user_id", nullable = false, updatable = false)
    private UUID userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(nullable = false)
    private String timezone;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /* ===================== RELATIONS ===================== */

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Habit> habits;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<DailyEntry> dailyEntries;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<DaySummary> daySummaries;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    private StreakState streakState;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<PointsLedger> pointsLedgers;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    private GrowthState growthState;
}
