package com.example.transitops.reports.service;

import com.example.transitops.reports.dto.*;

import java.util.List;

public interface ReportService {
    List<FuelEfficiencyResponse> getFuelEfficiency();
    FleetUtilizationResponse getFleetUtilization();
    List<OperationalCostResponse> getOperationalCost();
    List<VehicleROIResponse> getVehicleROI();
    CsvExportResponse exportCsv();
}
