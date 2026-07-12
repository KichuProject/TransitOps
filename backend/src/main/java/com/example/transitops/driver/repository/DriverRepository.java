package com.example.transitops.driver.repository;

import com.example.transitops.common.enums.DriverStatus;
import com.example.transitops.driver.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    boolean existsByLicenseNumber(String licenseNumber);
    List<Driver> findByStatus(DriverStatus status);
    long countByStatus(DriverStatus status);
}
