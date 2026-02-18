package com.stiq.habittracker.dto.request;

import com.stiq.habittracker.enums.HabitType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateHabitRequest {

    @NotBlank(message = "Habit name is required")
    private String name;

    @NotNull(message = "Habit type is required")
    private HabitType type;

    // Only required for QUANTITATIVE habits
    private Double dailyTarget;
    private Double minThreshold;
}
