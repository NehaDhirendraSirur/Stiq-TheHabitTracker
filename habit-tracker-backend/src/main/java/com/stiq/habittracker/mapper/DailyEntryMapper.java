package com.stiq.habittracker.mapper;

import com.stiq.habittracker.dto.response.DailyEntryResponse;
import com.stiq.habittracker.entity.DailyEntry;
import org.springframework.stereotype.Component;

@Component
public class DailyEntryMapper {

    public DailyEntryResponse toResponse(DailyEntry entry) {
        return DailyEntryResponse.builder()
                .entryId(entry.getEntryId())
                .habitId(entry.getHabit().getHabitId())
                .habitName(entry.getHabit().getName())
                .date(entry.getDate())
                .isCompleted(entry.getIsCompleted())
                .build();
    }
}