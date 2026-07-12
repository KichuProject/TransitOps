package com.example.transitops.trip.service;

import com.example.transitops.common.enums.DriverStatus;
import com.example.transitops.common.enums.TripStatus;
import com.example.transitops.common.enums.VehicleStatus;
import com.example.transitops.common.exception.BusinessException;
import com.example.transitops.common.exception.ResourceNotFoundException;
import com.example.transitops.driver.entity.Driver;
import com.example.transitops.driver.repository.DriverRepository;
import com.example.transitops.trip.dto.CompleteTripRequest;
import com.example.transitops.trip.dto.DispatchTripRequest;
import com.example.transitops.trip.dto.TripRequest;
import com.example.transitops.trip.dto.TripResponse;
import com.example.transitops.trip.entity.Trip;
import com.example.transitops.trip.mapper.TripMapper;
import com.example.transitops.trip.repository.TripRepository;
import com.example.transitops.vehicle.entity.Vehicle;
import com.example.transitops.vehicle.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripMapper tripMapper;

    public TripServiceImpl(TripRepository tripRepository, VehicleRepository vehicleRepository,
                           DriverRepository driverRepository, TripMapper tripMapper) {
        this.tripRepository = tripRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.tripMapper = tripMapper;
    }

    @Override
    public TripResponse create(TripRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + request.getVehicleId()));
        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + request.getDriverId()));

        if (vehicle.getStatus() == VehicleStatus.RETIRED) {
            throw new BusinessException("Cannot assign a RETIRED vehicle to a trip");
        }
        if (driver.getStatus() == DriverStatus.INACTIVE) {
            throw new BusinessException("Cannot assign an INACTIVE driver to a trip");
        }

        Trip trip = tripMapper.toEntity(request);
        trip.setVehicle(vehicle);
        trip.setDriver(driver);
        trip.setStatus(TripStatus.DRAFT);
        return tripMapper.toResponse(tripRepository.save(trip));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TripResponse> findAll() {
        return tripRepository.findAll().stream()
                .map(tripMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TripResponse findById(Long id) {
        return tripMapper.toResponse(getTrip(id));
    }

    @Override
    public TripResponse update(Long id, TripRequest request) {
        Trip trip = getTrip(id);
        if (trip.getStatus() != TripStatus.DRAFT) {
            throw new BusinessException("Only DRAFT trips can be updated");
        }

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + request.getVehicleId()));
        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + request.getDriverId()));

        trip.setSource(request.getSource());
        trip.setDestination(request.getDestination());
        trip.setCargoWeight(request.getCargoWeight());
        trip.setPlannedDistance(request.getPlannedDistance());
        trip.setVehicle(vehicle);
        trip.setDriver(driver);
        return tripMapper.toResponse(tripRepository.save(trip));
    }

    @Override
    public void delete(Long id) {
        Trip trip = getTrip(id);
        if (trip.getStatus() == TripStatus.DISPATCHED) {
            throw new BusinessException("Cannot delete a DISPATCHED trip");
        }
        tripRepository.deleteById(id);
    }

    @Override
    public TripResponse dispatch(Long id, DispatchTripRequest request) {
        Trip trip = getTrip(id);
        if (trip.getStatus() != TripStatus.DRAFT) {
            throw new BusinessException("Only DRAFT trips can be dispatched");
        }

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new BusinessException("Vehicle is not AVAILABLE for dispatch. Current status: " + vehicle.getStatus());
        }
        if (driver.getStatus() != DriverStatus.AVAILABLE) {
            throw new BusinessException("Driver is not AVAILABLE for dispatch. Current status: " + driver.getStatus());
        }
        if (vehicle.getMaximumLoadCapacity() < trip.getCargoWeight()) {
            throw new BusinessException("Cargo weight exceeds vehicle maximum load capacity");
        }

        vehicle.setStatus(VehicleStatus.IN_USE);
        driver.setStatus(DriverStatus.ON_DUTY);
        vehicleRepository.save(vehicle);
        driverRepository.save(driver);

        trip.setStatus(TripStatus.DISPATCHED);
        trip.setStartTime(LocalDateTime.now());
        return tripMapper.toResponse(tripRepository.save(trip));
    }

    @Override
    public TripResponse complete(Long id, CompleteTripRequest request) {
        Trip trip = getTrip(id);
        if (trip.getStatus() != TripStatus.DISPATCHED) {
            throw new BusinessException("Only DISPATCHED trips can be completed");
        }

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicle.setOdometer(vehicle.getOdometer() + request.getActualDistance());
        driver.setStatus(DriverStatus.AVAILABLE);
        vehicleRepository.save(vehicle);
        driverRepository.save(driver);

        trip.setStatus(TripStatus.COMPLETED);
        trip.setEndTime(LocalDateTime.now());
        trip.setActualDistance(request.getActualDistance());
        trip.setFuelConsumed(request.getFuelConsumed());
        return tripMapper.toResponse(tripRepository.save(trip));
    }

    @Override
    public TripResponse cancel(Long id) {
        Trip trip = getTrip(id);
        if (trip.getStatus() == TripStatus.COMPLETED || trip.getStatus() == TripStatus.CANCELLED) {
            throw new BusinessException("Trip is already " + trip.getStatus());
        }

        if (trip.getStatus() == TripStatus.DISPATCHED) {
            Vehicle vehicle = trip.getVehicle();
            Driver driver = trip.getDriver();
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            driver.setStatus(DriverStatus.AVAILABLE);
            vehicleRepository.save(vehicle);
            driverRepository.save(driver);
        }

        trip.setStatus(TripStatus.CANCELLED);
        trip.setEndTime(LocalDateTime.now());
        return tripMapper.toResponse(tripRepository.save(trip));
    }

    private Trip getTrip(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + id));
    }
}
