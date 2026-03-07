package com.stiq.habittracker.service;

import com.stiq.habittracker.dto.request.CreateHabitRequest;
import com.stiq.habittracker.dto.request.UpdateHabitRequest;
import com.stiq.habittracker.dto.response.HabitResponse;
import com.stiq.habittracker.entity.Habit;
import com.stiq.habittracker.entity.User;
import com.stiq.habittracker.enums.HabitType;
import com.stiq.habittracker.exception.ResourceNotFoundException;
import com.stiq.habittracker.mapper.HabitMapper;
import com.stiq.habittracker.repository.HabitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitRepository habitRepository;
    private final UserService userService;
    private final HabitMapper habitMapper;

    @Transactional
    public HabitResponse createHabit(CreateHabitRequest request) {
        User user = userService.getCurrentUser();
        if (request.getType() == HabitType.QUANTITATIVE) {
            if (request.getDailyTarget() == null)
                throw new IllegalArgumentException("dailyTarget is required for QUANTITATIVE habits");
            if (request.getMinThreshold() == null)
                throw new IllegalArgumentException("minThreshold is required for QUANTITATIVE habits");
        }
        Habit habit = Habit.builder()
                .user(user)
                .name(request.getName())
                .type(request.getType())
                .dailyTarget(request.getDailyTarget())
                .minThreshold(request.getMinThreshold())
                .isActive(true)
                .build();
        habitRepository.save(habit);
        return habitMapper.toResponse(habit);
    }

    @Transactional
    public HabitResponse updateHabit(UUID habitId, UpdateHabitRequest request) {
        Habit habit = getHabitForCurrentUser(habitId);
        habit.setName(request.getName());
        if (request.getDailyTarget() != null) habit.setDailyTarget(request.getDailyTarget());
        if (request.getMinThreshold() != null) habit.setMinThreshold(request.getMinThreshold());
        habitRepository.save(habit);
        return habitMapper.toResponse(habit);
    }

    @Transactional
    public void deactivateHabit(UUID habitId) {
        Habit habit = getHabitForCurrentUser(habitId);
        habit.setIsActive(false);
        habitRepository.save(habit);
    }

    @Transactional
    public void reactivateHabit(UUID habitId) {
        Habit habit = getHabitForCurrentUser(habitId);
        habit.setIsActive(true);
        habitRepository.save(habit);
    }

    public List<HabitResponse> getAllHabits() {
        User user = userService.getCurrentUser();
        return habitRepository.findByUser(user)
                .stream().map(habitMapper::toResponse).toList();
    }

    public List<HabitResponse> getActiveHabits() {
        User user = userService.getCurrentUser();
        return habitRepository.findByUserAndIsActiveTrue(user)
                .stream().map(habitMapper::toResponse).toList();
    }

    public HabitResponse getHabitById(UUID habitId) {
        return habitMapper.toResponse(getHabitForCurrentUser(habitId));
    }

    public Habit getHabitEntityById(UUID habitId) {
        return habitRepository.findById(habitId)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found: " + habitId));
    }

    private Habit getHabitForCurrentUser(UUID habitId) {
        User user = userService.getCurrentUser();
        Habit habit = getHabitEntityById(habitId);
        if (!habit.getUser().getUserId().equals(user.getUserId())) {
            throw new ResourceNotFoundException("Habit not found: " + habitId);
        }
        return habit;
    }
}