package com.example.transitops.vehicle.service;

import com.example.transitops.vehicle.dto.VehicleRequest;
import com.example.transitops.vehicle.dto.VehicleResponse;

import java.util.List;

public interface VehicleService {
    VehicleResponse create(VehicleRequest request);
    List<VehicleResponse> findAll();
    VehicleResponse findById(Long id);
    VehicleResponse update(Long id, VehicleRequest request);
    void delete(Long id);
}
