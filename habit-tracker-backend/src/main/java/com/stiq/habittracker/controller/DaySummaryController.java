package com.stiq.habittracker.controller;

import com.stiq.habittracker.dto.response.DaySummaryResponse;
import com.stiq.habittracker.service.DaySummaryService;
import com.stiq.habittracker.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/summary")
@RequiredArgsConstructor
public class DaySummaryController {

    private final DaySummaryService daySummaryService;

    // GET /api/summary/today
    @GetMapping("/today")
    public ResponseEntity<ApiResponse<DaySummaryResponse>> getToday() {
        DaySummaryResponse response = daySummaryService.getToday();
        return ResponseEntity
                .ok(ApiResponse.success(response));
    }

    // GET /api/summary?date=2026-02-27
    @GetMapping
    public ResponseEntity<ApiResponse<DaySummaryResponse>> getByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        DaySummaryResponse response = daySummaryService.getByDate(date);
        return ResponseEntity
                .ok(ApiResponse.success(response));
    }

    // GET /api/summary/range?start=2026-02-01&end=2026-02-27
    @GetMapping("/range")
    public ResponseEntity<ApiResponse<List<DaySummaryResponse>>> getRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        if (start.isAfter(end)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }

        List<DaySummaryResponse> response = daySummaryService.getRange(start, end);
        return ResponseEntity
                .ok(ApiResponse.success(response));
    }
}