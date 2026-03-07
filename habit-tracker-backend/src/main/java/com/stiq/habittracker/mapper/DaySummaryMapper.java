package com.stiq.habittracker.mapper;

import com.stiq.habittracker.dto.response.DaySummaryResponse;
import com.stiq.habittracker.entity.DaySummary;
import org.springframework.stereotype.Component;

@Component
public class DaySummaryMapper {

    public DaySummaryResponse toResponse(DaySummary summary) {
        return DaySummaryResponse.builder()
                .dayId(summary.getDayId())
                .date(summary.getDate())
                .activeHabits(summary.getActiveHabits())
                .completedHabitsCount(
                        summary.getCompletedHabits() != null
                                ? summary.getCompletedHabits().size()
                                : 0
                )
                .successRatio(summary.getSuccessRatio())
                .isSuccessDay(summary.getIsSuccessDay())
                .freezeUsed(summary.getFreezeUsed())
                .overallStreakAfterDay(summary.getOverallStreakAfterDay())
                .completedHabits(summary.getCompletedHabits())
                .failedHabits(summary.getFailedHabits())
                .build();
    }
}