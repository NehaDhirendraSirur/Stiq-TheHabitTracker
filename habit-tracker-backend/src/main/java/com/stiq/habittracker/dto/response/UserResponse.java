// UserResponse.java
package com.stiq.habittracker.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class UserResponse {
    private UUID userId;
    private String email;
    private String displayName;
    private String timezone;
}
