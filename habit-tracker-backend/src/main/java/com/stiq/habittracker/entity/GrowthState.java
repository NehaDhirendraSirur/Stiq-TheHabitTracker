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
    private GrowthTheme theme;

    @Column(nullable = false)
    private Integer level;

    @Column(name = "total_points", nullable = false)
    private Integer totalPoints;

    @Column(name = "visual_stage", nullable = false)
    private Integer visualStage;

    @Column(name = "custom_name")
    private String customName;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;
}
