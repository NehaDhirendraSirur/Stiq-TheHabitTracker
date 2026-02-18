// StreakStateResponse.java
package com.stiq.habittracker.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class StreakStateResponse {
    private Integer currentOverallStreak;
    private Integer longestOverallStreak;
    private LocalDate lastSuccessDate;
}
