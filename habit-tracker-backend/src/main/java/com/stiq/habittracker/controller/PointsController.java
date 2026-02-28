package com.stiq.habittracker.controller;

import com.stiq.habittracker.dto.response.PointsLedgerResponse;
import com.stiq.habittracker.service.PointsService;
import com.stiq.habittracker.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/points")
@RequiredArgsConstructor
public class PointsController {

    private final PointsService pointsService;

    // GET /api/points/history
    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<PointsLedgerResponse>>> getPointsHistory() {
        List<PointsLedgerResponse> response = pointsService.getPointsHistory();
        return ResponseEntity
                .ok(ApiResponse.success(response));
    }

    // GET /api/points/total
    @GetMapping("/total")
    public ResponseEntity<ApiResponse<Integer>> getTotalPoints() {
        Integer total = pointsService.getTotalPoints();
        return ResponseEntity
                .ok(ApiResponse.success(total));
    }
}