package com.stiq.habittracker.mapper;

import com.stiq.habittracker.dto.response.FreezeLedgerResponse;
import com.stiq.habittracker.dto.response.FreezeWalletResponse;
import com.stiq.habittracker.entity.StreakFreezeLedger;
import com.stiq.habittracker.entity.StreakFreezeWallet;
import org.springframework.stereotype.Component;

@Component
public class FreezeMapper {

    public FreezeWalletResponse toWalletResponse(StreakFreezeWallet wallet) {
        return FreezeWalletResponse.builder()
                .totalEarned(wallet.getTotalEarned())
                .totalUsed(wallet.getTotalUsed())
                .availableFreezes(wallet.getAvailableFreezes())
                .build();
    }

    public FreezeLedgerResponse toLedgerResponse(StreakFreezeLedger ledger) {
        return FreezeLedgerResponse.builder()
                .freezeId(ledger.getFreezeId())
                .type(ledger.getType())
                .source(ledger.getSource())
                .sourceRef(ledger.getSourceRef())
                .date(ledger.getDate())
                .createdAt(ledger.getCreatedAt())
                .build();
    }
}