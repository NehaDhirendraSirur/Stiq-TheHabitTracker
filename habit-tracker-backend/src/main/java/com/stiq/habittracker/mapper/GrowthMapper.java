package com.stiq.habittracker.mapper;

import com.stiq.habittracker.dto.response.GrowthStateResponse;
import com.stiq.habittracker.entity.GrowthState;
import org.springframework.stereotype.Component;

@Component
public class GrowthMapper {

    public GrowthStateResponse toResponse(GrowthState growth) {
        return GrowthStateResponse.builder()
                .theme(growth.getTheme())
                .level(growth.getLevel())
                .totalPoints(growth.getTotalPoints())
                .visualStage(growth.getVisualStage())
                .customName(growth.getCustomName())
                .build();
    }
}