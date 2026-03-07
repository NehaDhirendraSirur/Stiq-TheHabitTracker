package com.stiq.habittracker.service;

import com.stiq.habittracker.dto.request.UseFreezeRequest;
import com.stiq.habittracker.dto.response.FreezeLedgerResponse;
import com.stiq.habittracker.dto.response.FreezeWalletResponse;
import com.stiq.habittracker.engine.FreezeEngine;
import com.stiq.habittracker.entity.*;
import com.stiq.habittracker.exception.ResourceNotFoundException;
import com.stiq.habittracker.mapper.FreezeMapper;
import com.stiq.habittracker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FreezeService {

    private final StreakFreezeWalletRepository walletRepository;
    private final StreakFreezeLedgerRepository ledgerRepository;
    private final FreezeEngine freezeEngine;
    private final UserService userService;
    private final FreezeMapper freezeMapper;

    public FreezeWalletResponse getWallet() {
        User user = userService.getCurrentUser();
        StreakFreezeWallet wallet = walletRepository
                .findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Freeze wallet not found"));
        return freezeMapper.toWalletResponse(wallet);
    }

    @Transactional
    public FreezeWalletResponse useFreeze(UseFreezeRequest request) {
        User user = userService.getCurrentUser();
        freezeEngine.useFreeze(user, "MANUAL_" + request.getDate());
        StreakFreezeWallet wallet = walletRepository
                .findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Freeze wallet not found"));
        return freezeMapper.toWalletResponse(wallet);
    }

    public List<FreezeLedgerResponse> getFreezeHistory() {
        User user = userService.getCurrentUser();
        return ledgerRepository.findByUser(user)
                .stream().map(freezeMapper::toLedgerResponse).toList();
    }
}