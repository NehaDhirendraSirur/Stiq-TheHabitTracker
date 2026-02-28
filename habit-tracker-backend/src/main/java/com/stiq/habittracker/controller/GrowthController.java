package com.stiq.habittracker.controller;

import com.stiq.habittracker.dto.response.GrowthStateResponse;
import com.stiq.habittracker.service.GrowthService;
import com.stiq.habittracker.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/growth")
@RequiredArgsConstructor
public class GrowthController {

    private final GrowthService growthService;

    // GET /api/growth
    @GetMapping
    public ResponseEntity<ApiResponse<GrowthStateResponse>> getGrowthState() {
        GrowthStateResponse response = growthService.getGrowthState();
        return ResponseEntity
                .ok(ApiResponse.success(response));
    }

    // POST /api/growth/sync
    @PostMapping("/sync")
    public ResponseEntity<ApiResponse<GrowthStateResponse>> syncGrowth() {
        GrowthStateResponse response = growthService.syncGrowth();
        return ResponseEntity
                .ok(ApiResponse.success("Growth state synced successfully", response));
    }
}