package com.stiq.habittracker.controller;

import com.stiq.habittracker.dto.response.HabitStreakResponse;
import com.stiq.habittracker.dto.response.StreakStateResponse;
import com.stiq.habittracker.service.StreakService;
import com.stiq.habittracker.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/streaks")
@RequiredArgsConstructor
public class StreakController {

    private final StreakService streakService;

    // GET /api/streaks/overall
    @GetMapping("/overall")
    public ResponseEntity<ApiResponse<StreakStateResponse>> getOverallStreak() {
        StreakStateResponse response = streakService.getOverallStreak();
        return ResponseEntity
                .ok(ApiResponse.success(response));
    }

    // GET /api/streaks/habits
    @GetMapping("/habits")
    public ResponseEntity<ApiResponse<List<HabitStreakResponse>>> getAllHabitStreaks() {
        List<HabitStreakResponse> response = streakService.getAllHabitStreaks();
        return ResponseEntity
                .ok(ApiResponse.success(response));
    }

    // GET /api/streaks/habits/{habitId}
    @GetMapping("/habits/{habitId}")
    public ResponseEntity<ApiResponse<HabitStreakResponse>> getHabitStreak(
            @PathVariable UUID habitId
    ) {
        HabitStreakResponse response = streakService.getHabitStreak(habitId);
        return ResponseEntity
                .ok(ApiResponse.success(response));
    }
}