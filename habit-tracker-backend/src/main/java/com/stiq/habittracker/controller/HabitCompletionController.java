package com.stiq.habittracker.controller;

import com.stiq.habittracker.dto.request.CompleteHabitRequest;
import com.stiq.habittracker.dto.request.FailHabitRequest;
import com.stiq.habittracker.dto.response.DailyEntryResponse;
import com.stiq.habittracker.dto.response.DaySummaryResponse;
import com.stiq.habittracker.service.HabitCompletionService;
import com.stiq.habittracker.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitCompletionController {

    private final HabitCompletionService habitCompletionService;

    // POST /api/habits/{habitId}/complete
    @PostMapping("/{habitId}/complete")
    public ResponseEntity<ApiResponse<DaySummaryResponse>> completeHabit(
            @PathVariable UUID habitId,
            @Valid @RequestBody CompleteHabitRequest request
    ) {
        request.setHabitId(habitId);
        DaySummaryResponse response = habitCompletionService.completeHabit(request);
        return ResponseEntity
                .ok(ApiResponse.success("Habit marked as completed", response));
    }

    // POST /api/habits/{habitId}/fail
    @PostMapping("/{habitId}/fail")
    public ResponseEntity<ApiResponse<DaySummaryResponse>> failHabit(
            @PathVariable UUID habitId,
            @Valid @RequestBody FailHabitRequest request
    ) {
        request.setHabitId(habitId);
        DaySummaryResponse response = habitCompletionService.failHabit(request);
        return ResponseEntity
                .ok(ApiResponse.success("Habit marked as failed", response));
    }

    // GET /api/habits/{habitId}/entries
    @GetMapping("/{habitId}/entries")
    public ResponseEntity<ApiResponse<List<DailyEntryResponse>>> getEntriesForHabit(
            @PathVariable UUID habitId
    ) {
        List<DailyEntryResponse> entries = habitCompletionService.getEntriesForHabit(habitId);
        return ResponseEntity
                .ok(ApiResponse.success(entries));
    }

    // GET /api/entries?date=2026-02-27
    @GetMapping("/entries")
    public ResponseEntity<ApiResponse<List<DailyEntryResponse>>> getEntriesForDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<DailyEntryResponse> entries = habitCompletionService.getEntriesForDate(date);
        return ResponseEntity
                .ok(ApiResponse.success(entries));
    }
}