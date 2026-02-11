package com.stiq.habittracker.entity;


import com.stiq.habittracker.enums.FreezeSource;
import com.stiq.habittracker.enums.FreezeType;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Table(name = "streak_freeze_ledger")
public class StreakFreezeLedger {


    @Id
    @GeneratedValue
    private UUID freezeId;


    @Column(nullable = false)
    private UUID userId;


    @Enumerated(EnumType.STRING)
    private FreezeType type;


    @Enumerated(EnumType.STRING)
    private FreezeSource source;


    private String sourceRef; // e.g. "10_day_streak"


    private LocalDate date;


    private LocalDateTime createdAt;


    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}