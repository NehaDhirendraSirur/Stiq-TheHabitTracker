// GrowthStateResponse.java
package com.stiq.habittracker.dto.response;

import com.stiq.habittracker.enums.GrowthTheme;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GrowthStateResponse {
    private GrowthTheme theme;
    private Integer level;
    private Integer totalPoints;
    private Integer visualStage;
    private String customName;
}
