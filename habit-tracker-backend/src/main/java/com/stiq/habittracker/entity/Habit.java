package com.stiq.habittracker.entity;

import com.stiq.habittracker.enums.HabitType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "habits")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Habit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "habit_id")
    private UUID habitId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HabitType type;

    @Column(name = "daily_target")
    private Double dailyTarget;     // optional (quantitative habits)

    @Column(name = "min_threshold")
    private Double minThreshold;    // optional (quantitative habits)

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "habit", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DailyEntry> dailyEntries = new ArrayList<>();

    @OneToOne(mappedBy = "habit", cascade = CascadeType.ALL, orphanRemoval = true)
    private HabitStreak habitStreak;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.isActive == null) this.isActive = true;
    }
}
