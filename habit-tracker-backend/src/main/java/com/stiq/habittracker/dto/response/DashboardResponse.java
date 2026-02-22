// DashboardResponse.java
package com.stiq.habittracker.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardResponse {
    private DaySummaryResponse todaySummary;
    private StreakStateResponse streakState;
    private GrowthStateResponse growthState;
    private FreezeWalletResponse freezeWallet;
}