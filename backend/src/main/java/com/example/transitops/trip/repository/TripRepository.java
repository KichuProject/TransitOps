package com.example.transitops.trip.repository;

import com.example.transitops.common.enums.TripStatus;
import com.example.transitops.trip.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    long countByStatus(TripStatus status);
    List<Trip> findByStatus(TripStatus status);
    List<Trip> findByVehicleId(Long vehicleId);
    List<Trip> findByDriverId(Long driverId);
}
