// FreezeLedgerResponse.java
package com.stiq.habittracker.dto.response;

import com.stiq.habittracker.enums.FreezeSource;
import com.stiq.habittracker.enums.FreezeType;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class FreezeLedgerResponse {
    private UUID freezeId;
    private FreezeType type;
    private FreezeSource source;
    private String sourceRef;
    private LocalDate date;
    private LocalDateTime createdAt;
}