package com.stiq.habittracker.service;

import com.stiq.habittracker.dto.response.GrowthStateResponse;
import com.stiq.habittracker.engine.GrowthEngine;
import com.stiq.habittracker.entity.*;
import com.stiq.habittracker.exception.ResourceNotFoundException;
import com.stiq.habittracker.repository.GrowthStateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GrowthService {

    private final GrowthStateRepository growthStateRepository;
    private final GrowthEngine growthEngine;
    private final UserService userService;

    // -------------------- Fetch --------------------

    public GrowthStateResponse getGrowthState() {
        User user = userService.getCurrentUser();

        GrowthState growth = growthStateRepository
                .findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Growth state not found"
                ));

        return toResponse(growth);
    }

    // -------------------- Sync --------------------

    @Transactional
    public GrowthStateResponse syncGrowth() {
        User user = userService.getCurrentUser();
        growthEngine.syncGrowth(user);

        GrowthState growth = growthStateRepository
                .findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Growth state not found"
                ));

        return toResponse(growth);
    }

    // -------------------- Mapper --------------------

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