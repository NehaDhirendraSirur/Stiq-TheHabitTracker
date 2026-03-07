package com.stiq.habittracker.service;

import com.stiq.habittracker.dto.response.GrowthStateResponse;
import com.stiq.habittracker.engine.GrowthEngine;
import com.stiq.habittracker.entity.*;
import com.stiq.habittracker.exception.ResourceNotFoundException;
import com.stiq.habittracker.mapper.GrowthMapper;
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
    private final GrowthMapper growthMapper;

    public GrowthStateResponse getGrowthState() {
        User user = userService.getCurrentUser();
        GrowthState growth = growthStateRepository
                .findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Growth state not found"));
        return growthMapper.toResponse(growth);
    }

    @Transactional
    public GrowthStateResponse syncGrowth() {
        User user = userService.getCurrentUser();
        growthEngine.syncGrowth(user);
        GrowthState growth = growthStateRepository
                .findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Growth state not found"));
        return growthMapper.toResponse(growth);
    }
}