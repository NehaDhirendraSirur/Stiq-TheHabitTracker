package com.stiq.habittracker.entity;

import com.stiq.habittracker.enums.PointsSource;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "points_ledger")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PointsLedger {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ledger_id")
    private UUID ledgerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PointsSource source;

    @Column(name = "source_ref_id")
    private UUID sourceRefId;

    @Column(nullable = false)
    private Integer points;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
