package com.stiq.habittracker.mapper;

import com.stiq.habittracker.dto.response.UserResponse;
import com.stiq.habittracker.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .timezone(user.getTimezone())
                .build();
    }
}