package com.stiq.habittracker.repository;

import com.stiq.habittracker.entity.PointsLedger;
import com.stiq.habittracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PointsLedgerRepository extends JpaRepository<PointsLedger, UUID> {

    List<PointsLedger> findByUser(User user);

    List<PointsLedger> findByUserOrderByCreatedAtDesc(User user);
}
