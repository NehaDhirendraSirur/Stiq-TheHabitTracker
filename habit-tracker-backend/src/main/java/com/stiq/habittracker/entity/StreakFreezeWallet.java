package com.stiq.habittracker.entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Table(name = "streak_freeze_wallet")
public class StreakFreezeWallet {


    @Id
    @GeneratedValue
    private UUID walletId;


    @Column(nullable = false, unique = true)
    private UUID userId;


    private int totalEarned;
    private int totalUsed;
    private int availableFreezes;


    private LocalDateTime updatedAt;


    @PrePersist
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}