package com.stiq.habittracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateHabitRequest {

    @NotBlank(message = "Habit name is required")
    private String name;

    private Double dailyTarget;
    private Double minThreshold;
}
