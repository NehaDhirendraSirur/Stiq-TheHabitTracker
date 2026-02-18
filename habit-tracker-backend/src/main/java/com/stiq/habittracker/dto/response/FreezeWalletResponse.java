// FreezeWalletResponse.java
package com.stiq.habittracker.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FreezeWalletResponse {
    private Integer totalEarned;
    private Integer totalUsed;
    private Integer availableFreezes;
}
