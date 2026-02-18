// PointsLedgerResponse.java
package com.stiq.habittracker.dto.response;

import com.stiq.habittracker.enums.PointsSource;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class PointsLedgerResponse {
    private UUID ledgerId;
    private PointsSource source;
    private Integer points;
    private LocalDateTime createdAt;
}
