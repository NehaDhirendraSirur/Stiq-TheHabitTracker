package com.stiq.habittracker.entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

import lombok.*;

@Entity
@Table(name = "streak_freeze_wallet")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StreakFreezeWallet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "wallet_id")
    private UUID walletId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "total_earned", nullable = false)
    @Builder.Default
    private Integer totalEarned = 0;

    @Column(name = "total_used", nullable = false)
    @Builder.Default
    private Integer totalUsed = 0;

    @Column(name = "available_freezes", nullable = false)
    @Builder.Default
    private Integer availableFreezes = 0;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
