package com.stiq.habittracker.service;

import com.stiq.habittracker.dto.response.PointsLedgerResponse;
import com.stiq.habittracker.entity.*;
import com.stiq.habittracker.repository.PointsLedgerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PointsService {

    private final PointsLedgerRepository pointsLedgerRepository;
    private final UserService userService;

    // -------------------- Fetch --------------------

    public List<PointsLedgerResponse> getPointsHistory() {
        User user = userService.getCurrentUser();

        return pointsLedgerRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public Integer getTotalPoints() {
        User user = userService.getCurrentUser();

        return pointsLedgerRepository
                .findByUser(user)
                .stream()
                .mapToInt(PointsLedger::getPoints)
                .sum();
    }

    // -------------------- Mapper --------------------

    private PointsLedgerResponse toResponse(PointsLedger ledger) {
        return PointsLedgerResponse.builder()
                .ledgerId(ledger.getLedgerId())
                .source(ledger.getSource())
                .points(ledger.getPoints())
                .createdAt(ledger.getCreatedAt())
                .build();
    }
}