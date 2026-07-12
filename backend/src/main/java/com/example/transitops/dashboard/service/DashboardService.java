package com.example.transitops.dashboard.service;

import com.example.transitops.common.enums.VehicleStatus;
import com.example.transitops.common.enums.VehicleType;
import com.example.transitops.dashboard.dto.DashboardResponse;

public interface DashboardService {
    DashboardResponse getDashboard(VehicleType vehicleType, VehicleStatus status, String region);
}
