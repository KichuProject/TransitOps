package com.example.transitops.vehicle.controller;


// Vehicle Management Module.
//
// Responsible for tracking and managing the fleet.
//
// Lifecycle:
//
// Active
// ↓
// In Maintenance
// ↓
// Retired
import com.example.transitops.common.response.ApiResponse;
import com.example.transitops.vehicle.dto.VehicleRequest;
import com.example.transitops.vehicle.dto.VehicleResponse;
import com.example.transitops.vehicle.service.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * REST Controller for Vehicle operations.
 *
 * Responsibilities:
 * - Accept HTTP requests
 * - Validate request payload
 * - Delegate processing to Service layer
 * - Return standardized API responses
 *
 * Never implement business logic here.
 */

@RestController
@RequestMapping("/vehicles")
@Tag(name = "Vehicles", description = "Vehicle registry management")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    @Operation(summary = "Register a new vehicle")
    public ResponseEntity<ApiResponse<VehicleResponse>> create(@Valid @RequestBody VehicleRequest request) {
        VehicleResponse response = vehicleService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Vehicle registered successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all vehicles")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> findAll() {
        return ResponseEntity.ok(ApiResponse.success(vehicleService.findAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get vehicle by ID")
    public ResponseEntity<ApiResponse<VehicleResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(vehicleService.findById(id)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update vehicle")
    public ResponseEntity<ApiResponse<VehicleResponse>> update(@PathVariable Long id, @Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Vehicle updated successfully", vehicleService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete vehicle")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        vehicleService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Vehicle deleted successfully", null));
    }
}

