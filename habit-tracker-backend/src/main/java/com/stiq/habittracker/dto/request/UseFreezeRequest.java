// UseFreezeRequest.java
package com.stiq.habittracker.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UseFreezeRequest {

    @NotNull(message = "Date is required")
    private LocalDate date;
}