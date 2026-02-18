// HabitResponse.java
package com.stiq.habittracker.dto.response;

import com.stiq.habittracker.enums.HabitType;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class HabitResponse {
    private UUID habitId;
    private String name;
    private HabitType type;
    private Double dailyTarget;
    private Double minThreshold;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
