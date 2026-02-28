package com.stiq.habittracker.controller;

import com.stiq.habittracker.dto.request.UseFreezeRequest;
import com.stiq.habittracker.dto.response.FreezeLedgerResponse;
import com.stiq.habittracker.dto.response.FreezeWalletResponse;
import com.stiq.habittracker.service.FreezeService;
import com.stiq.habittracker.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/freezes")
@RequiredArgsConstructor
public class FreezeController {

    private final FreezeService freezeService;

    // GET /api/freezes/wallet
    @GetMapping("/wallet")
    public ResponseEntity<ApiResponse<FreezeWalletResponse>> getWallet() {
        FreezeWalletResponse response = freezeService.getWallet();
        return ResponseEntity
                .ok(ApiResponse.success(response));
    }

    // GET /api/freezes/history
    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<FreezeLedgerResponse>>> getFreezeHistory() {
        List<FreezeLedgerResponse> response = freezeService.getFreezeHistory();
        return ResponseEntity
                .ok(ApiResponse.success(response));
    }

    // POST /api/freezes/use
    @PostMapping("/use")
    public ResponseEntity<ApiResponse<FreezeWalletResponse>> useFreeze(
            @Valid @RequestBody UseFreezeRequest request
    ) {
        FreezeWalletResponse response = freezeService.useFreeze(request);
        return ResponseEntity
                .ok(ApiResponse.success("Freeze used successfully", response));
    }
}