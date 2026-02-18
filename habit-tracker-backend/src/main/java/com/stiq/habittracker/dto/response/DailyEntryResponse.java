// DailyEntryResponse.java
package com.stiq.habittracker.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class DailyEntryResponse {
    private UUID entryId;
    private UUID habitId;
    private String habitName;
    private LocalDate date;
    private Boolean isCompleted;
}
