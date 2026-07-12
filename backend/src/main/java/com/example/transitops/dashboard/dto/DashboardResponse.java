package com.example.transitops.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private long totalVehicles;
    private long availableVehicles;
    private long vehiclesInUse;
    private long vehiclesUnderMaintenance;
    private long retiredVehicles;

    private long totalDrivers;
    private long availableDrivers;
    private long driversOnDuty;

    private long totalTrips;
    private long activeTrips;       // DISPATCHED
    private long pendingTrips;      // DRAFT
    private long completedTrips;
    private long cancelledTrips;

    private double fleetUtilizationPercent; // (IN_USE / total) * 100
}
