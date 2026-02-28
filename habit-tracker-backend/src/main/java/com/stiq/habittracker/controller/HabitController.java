package com.stiq.habittracker.controller;

import com.stiq.habittracker.dto.request.CreateHabitRequest;
import com.stiq.habittracker.dto.request.UpdateHabitRequest;
import com.stiq.habittracker.dto.response.HabitResponse;
import com.stiq.habittracker.service.HabitService;
import com.stiq.habittracker.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;

    // POST /api/habits
    @PostMapping
    public ResponseEntity<ApiResponse<HabitResponse>> createHabit(
            @Valid @RequestBody CreateHabitRequest request
    ) {
        HabitResponse response = habitService.createHabit(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Habit created successfully", response));
    }

    // GET /api/habits
    @GetMapping
    public ResponseEntity<ApiResponse<List<HabitResponse>>> getAllHabits() {
        List<HabitResponse> habits = habitService.getAllHabits();
        return ResponseEntity
                .ok(ApiResponse.success(habits));
    }

    // GET /api/habits/active
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<HabitResponse>>> getActiveHabits() {
        List<HabitResponse> habits = habitService.getActiveHabits();
        return ResponseEntity
                .ok(ApiResponse.success(habits));
    }

    // GET /api/habits/{habitId}
    @GetMapping("/{habitId}")
    public ResponseEntity<ApiResponse<HabitResponse>> getHabitById(
            @PathVariable UUID habitId
    ) {
        HabitResponse habit = habitService.getHabitById(habitId);
        return ResponseEntity
                .ok(ApiResponse.success(habit));
    }

    // PUT /api/habits/{habitId}
    @PutMapping("/{habitId}")
    public ResponseEntity<ApiResponse<HabitResponse>> updateHabit(
            @PathVariable UUID habitId,
            @Valid @RequestBody UpdateHabitRequest request
    ) {
        HabitResponse habit = habitService.updateHabit(habitId, request);
        return ResponseEntity
                .ok(ApiResponse.success("Habit updated successfully", habit));
    }

    // PATCH /api/habits/{habitId}/deactivate
    @PatchMapping("/{habitId}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateHabit(
            @PathVariable UUID habitId
    ) {
        habitService.deactivateHabit(habitId);
        return ResponseEntity
                .ok(ApiResponse.success("Habit deactivated successfully", null));
    }

    // PATCH /api/habits/{habitId}/reactivate
    @PatchMapping("/{habitId}/reactivate")
    public ResponseEntity<ApiResponse<Void>> reactivateHabit(
            @PathVariable UUID habitId
    ) {
        habitService.reactivateHabit(habitId);
        return ResponseEntity
                .ok(ApiResponse.success("Habit reactivated successfully", null));
    }
}