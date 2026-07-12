package com.example.transitops.finance.service;

import com.example.transitops.finance.dto.FuelLogRequest;
import com.example.transitops.finance.dto.FuelLogResponse;

import java.util.List;

public interface FuelLogService {
    FuelLogResponse create(FuelLogRequest request);
    List<FuelLogResponse> findAll();
    FuelLogResponse findById(Long id);
    FuelLogResponse update(Long id, FuelLogRequest request);
    void delete(Long id);
}
