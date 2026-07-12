package com.example.transitops.maintenance.service;

import com.example.transitops.maintenance.dto.MaintenanceRequest;
import com.example.transitops.maintenance.dto.MaintenanceResponse;

import java.util.List;

public interface MaintenanceService {
    MaintenanceResponse create(MaintenanceRequest request);
    List<MaintenanceResponse> findAll();
    MaintenanceResponse findById(Long id);
    MaintenanceResponse update(Long id, MaintenanceRequest request);
    void delete(Long id);
    MaintenanceResponse close(Long id);
}
