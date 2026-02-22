// AuthResponse.java
package com.stiq.habittracker.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String tokenType;
    private UserResponse user;
}