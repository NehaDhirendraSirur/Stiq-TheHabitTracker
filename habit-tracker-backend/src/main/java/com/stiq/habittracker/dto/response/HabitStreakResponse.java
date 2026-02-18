// HabitStreakResponse.java
package com.stiq.habittracker.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class HabitStreakResponse {
    private UUID habitId;
    private String habitName;
    private Integer currentStreak;
    private Integer longestStreak;
    private LocalDate lastCompletedDate;
}
