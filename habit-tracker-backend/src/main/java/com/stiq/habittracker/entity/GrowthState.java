package com.stiq.habittracker.entity;

import com.stiq.habittracker.enums.GrowthTheme;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "growth_state")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class GrowthState {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "growth_id")
    private UUID growthId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private GrowthTheme theme = GrowthTheme.NATURE;

    @Column(nullable = false)
    @Builder.Default
    private Integer level = 1;

    @Column(name = "total_points", nullable = false)
    @Builder.Default
    private Integer totalPoints = 0;

    @Column(name = "visual_stage", nullable = false)
    @Builder.Default
    private Integer visualStage = 1;

    @Column(name = "custom_name")
    private String customName;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }
}
