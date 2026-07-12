package com.example.transitops.dashboard.service;

import com.example.transitops.common.enums.DriverStatus;
import com.example.transitops.common.enums.TripStatus;
import com.example.transitops.common.enums.VehicleStatus;
import com.example.transitops.dashboard.dto.DashboardResponse;
import com.example.transitops.driver.repository.DriverRepository;
import com.example.transitops.trip.repository.TripRepository;
import com.example.transitops.vehicle.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;

    public DashboardServiceImpl(VehicleRepository vehicleRepository,
                                DriverRepository driverRepository,
                                TripRepository tripRepository) {
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.tripRepository = tripRepository;
    }

    @Override
    public DashboardResponse getDashboard() {
        long totalVehicles       = vehicleRepository.count();
        long availableVehicles   = vehicleRepository.countByStatus(VehicleStatus.AVAILABLE);
        long vehiclesInUse       = vehicleRepository.countByStatus(VehicleStatus.IN_USE);
        long underMaintenance    = vehicleRepository.countByStatus(VehicleStatus.UNDER_MAINTENANCE);
        long retiredVehicles     = vehicleRepository.countByStatus(VehicleStatus.RETIRED);

        long totalDrivers        = driverRepository.count();
        long availableDrivers    = driverRepository.countByStatus(DriverStatus.AVAILABLE);
        long driversOnDuty       = driverRepository.countByStatus(DriverStatus.ON_DUTY);

        long totalTrips          = tripRepository.count();
        long activeTrips         = tripRepository.countByStatus(TripStatus.DISPATCHED);
        long pendingTrips        = tripRepository.countByStatus(TripStatus.DRAFT);
        long completedTrips      = tripRepository.countByStatus(TripStatus.COMPLETED);
        long cancelledTrips      = tripRepository.countByStatus(TripStatus.CANCELLED);

        double utilization = totalVehicles > 0
                ? Math.round((vehiclesInUse * 100.0 / totalVehicles) * 100.0) / 100.0
                : 0.0;

        return DashboardResponse.builder()
                .totalVehicles(totalVehicles)
                .availableVehicles(availableVehicles)
                .vehiclesInUse(vehiclesInUse)
                .vehiclesUnderMaintenance(underMaintenance)
                .retiredVehicles(retiredVehicles)
                .totalDrivers(totalDrivers)
                .availableDrivers(availableDrivers)
                .driversOnDuty(driversOnDuty)
                .totalTrips(totalTrips)
                .activeTrips(activeTrips)
                .pendingTrips(pendingTrips)
                .completedTrips(completedTrips)
                .cancelledTrips(cancelledTrips)
                .fleetUtilizationPercent(utilization)
                .build();
    }
}
