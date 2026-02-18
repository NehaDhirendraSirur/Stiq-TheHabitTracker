// DaySummaryResponse.java
package com.stiq.habittracker.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
public class DaySummaryResponse {
    private UUID dayId;
    private LocalDate date;
    private Integer activeHabits;
    private Integer completedHabitsCount;
    private Double successRatio;
    private Boolean isSuccessDay;
    private Boolean freezeUsed;
    private Integer overallStreakAfterDay;
    private Set<UUID> completedHabits;
    private Set<UUID> failedHabits;
}
