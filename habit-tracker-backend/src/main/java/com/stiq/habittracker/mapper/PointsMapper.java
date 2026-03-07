package com.stiq.habittracker.mapper;

import com.stiq.habittracker.dto.response.PointsLedgerResponse;
import com.stiq.habittracker.entity.PointsLedger;
import org.springframework.stereotype.Component;

@Component
public class PointsMapper {

    public PointsLedgerResponse toResponse(PointsLedger ledger) {
        return PointsLedgerResponse.builder()
                .ledgerId(ledger.getLedgerId())
                .source(ledger.getSource())
                .points(ledger.getPoints())
                .createdAt(ledger.getCreatedAt())
                .build();
    }
}