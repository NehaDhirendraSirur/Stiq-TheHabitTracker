package com.stiq.habittracker.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class FailHabitRequest {

    @NotNull(message = "Habit ID is required")
    private UUID habitId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private boolean useFreeze = false;
}
