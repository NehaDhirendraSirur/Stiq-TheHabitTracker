package com.stiq.habittracker.entity;


import com.stiq.habittracker.enums.FreezeSource;
import com.stiq.habittracker.enums.FreezeType;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import lombok.*;

@Entity
@Table(name = "streak_freeze_ledger")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StreakFreezeLedger {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "freeze_id")
    private UUID freezeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FreezeType type;   // EARNED / USED

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FreezeSource source;   // STREAK / MANUAL / AUTO / SYSTEM

    @Column(name = "source_ref")
    private String sourceRef;  // e.g. "STREAK_10", "AUTO_2025-02-10"

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
