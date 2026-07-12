import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_TRIPS,
  INITIAL_MAINTENANCE,
  INITIAL_FUEL,
  INITIAL_EXPENSES
} from '../constants/mockData';

const MockDataContext = createContext();

export const useMockData = () => useContext(MockDataContext);

export const MockDataProvider = ({ children }) => {
  // Load initial data from localStorage if exists, else seed
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('to_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default to manager
  });

  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('to_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem('to_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('to_trips');
    return saved ? JSON.parse(saved) : INITIAL_TRIPS;
  });

  const [maintenance, setMaintenance] = useState(() => {
    const saved = localStorage.getItem('to_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  const [fuelLogs, setFuelLogs] = useState(() => {
    const saved = localStorage.getItem('to_fuel');
    return saved ? JSON.parse(saved) : INITIAL_FUEL;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('to_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('to_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('to_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('to_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('to_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('to_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('to_maintenance', JSON.stringify(maintenance));
  }, [maintenance]);

  useEffect(() => {
    localStorage.setItem('to_fuel', JSON.stringify(fuelLogs));
  }, [fuelLogs]);

  useEffect(() => {
    localStorage.setItem('to_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('to_dark_mode', JSON.stringify(darkMode));
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Alert/Toast simulation
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Helper date checker for driving licenses
  const isLicenseExpired = (expiryDate) => {
    const today = new Date('2026-07-12'); // Fixed hackathon date
    return new Date(expiryDate) < today;
  };

  // --- VEHICLE ACTIONS ---
  const addVehicle = (newVehicle) => {
    // Unique registration validation
    const exists = vehicles.some(v => v.regNo.toLowerCase() === newVehicle.regNo.toLowerCase());
    if (exists) {
      addToast(`Vehicle registration "${newVehicle.regNo}" already exists!`, 'danger');
      return false;
    }
    const vehicle = {
      ...newVehicle,
      id: 'V' + (Date.now()),
      maxCapacity: Number(newVehicle.maxCapacity),
      odometer: Number(newVehicle.odometer),
      acquisitionCost: Number(newVehicle.acquisitionCost),
      status: newVehicle.status || 'Available'
    };
    setVehicles(prev => [...prev, vehicle]);
    addToast(`Vehicle ${vehicle.regNo} registered successfully!`, 'success');
    return true;
  };

  const updateVehicle = (updated) => {
    // Unique registration check excluding current id
    const exists = vehicles.some(v => v.id !== updated.id && v.regNo.toLowerCase() === updated.regNo.toLowerCase());
    if (exists) {
      addToast(`Vehicle registration "${updated.regNo}" is taken!`, 'danger');
      return false;
    }
    setVehicles(prev => prev.map(v => v.id === updated.id ? {
      ...updated,
      maxCapacity: Number(updated.maxCapacity),
      odometer: Number(updated.odometer),
      acquisitionCost: Number(updated.acquisitionCost)
    } : v));
    addToast(`Vehicle ${updated.regNo} updated!`, 'success');
    return true;
  };

  const deleteVehicle = (id) => {
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) return;
    
    // Check if on trip
    if (vehicle.status === 'On Trip') {
      addToast(`Cannot delete Vehicle ${vehicle.regNo} while it is On Trip!`, 'danger');
      return false;
    }
    
    setVehicles(prev => prev.filter(v => v.id !== id));
    addToast(`Vehicle ${vehicle.regNo} removed from registry.`, 'warning');
    return true;
  };

  // --- DRIVER ACTIONS ---
  const addDriver = (newDriver) => {
    const driver = {
      ...newDriver,
      id: 'D' + (Date.now()),
      safetyScore: Number(newDriver.safetyScore || 100),
      status: newDriver.status || 'Available'
    };
    setDrivers(prev => [...prev, driver]);
    addToast(`Driver ${driver.name} profile created!`, 'success');
    return true;
  };

  const updateDriver = (updated) => {
    setDrivers(prev => prev.map(d => d.id === updated.id ? {
      ...updated,
      safetyScore: Number(updated.safetyScore)
    } : d));
    addToast(`Driver ${updated.name} profile updated!`, 'success');
    return true;
  };

  const deleteDriver = (id) => {
    const driver = drivers.find(d => d.id === id);
    if (!driver) return;
    
    if (driver.status === 'On Trip') {
      addToast(`Cannot delete Driver ${driver.name} while on an active trip!`, 'danger');
      return false;
    }

    setDrivers(prev => prev.filter(d => d.id !== id));
    addToast(`Driver ${driver.name} profile removed.`, 'warning');
    return true;
  };

  // --- TRIP ACTIONS ---
  const createTrip = (tripForm) => {
    const vehicle = vehicles.find(v => v.id === tripForm.vehicleId);
    const driver = drivers.find(d => d.id === tripForm.driverId);

    if (!vehicle || !driver) {
      addToast("Invalid Vehicle or Driver selection", "danger");
      return false;
    }

    // Capacity Validation
    if (Number(tripForm.cargoWeight) > vehicle.maxCapacity) {
      addToast(`Cargo Weight (${tripForm.cargoWeight}kg) exceeds Vehicle Max Capacity (${vehicle.maxCapacity}kg)!`, 'danger');
      return false;
    }

    // Driver Status Checks
    if (driver.status === 'Suspended') {
      addToast("Cannot assign a Suspended driver to a trip!", 'danger');
      return false;
    }
    if (isLicenseExpired(driver.expiryDate)) {
      addToast("Cannot assign a driver with an Expired license!", 'danger');
      return false;
    }
    if (driver.status === 'On Trip') {
      addToast("Driver is already On Trip!", 'danger');
      return false;
    }

    // Vehicle Status Checks
    if (vehicle.status !== 'Available') {
      addToast(`Vehicle is currently ${vehicle.status} (must be Available)!`, 'danger');
      return false;
    }

    const newTrip = {
      ...tripForm,
      id: 'T' + Date.now(),
      tripNo: 'TRIP-' + (100 + trips.length + 1),
      cargoWeight: Number(tripForm.cargoWeight),
      distance: Number(tripForm.distance),
      status: 'Draft',
      date: new Date('2026-07-12').toISOString().split('T')[0],
      odometerStart: vehicle.odometer,
      odometerEnd: null,
      fuelConsumed: null
    };

    setTrips(prev => [...prev, newTrip]);
    addToast(`Trip draft ${newTrip.tripNo} created!`, 'success');
    return true;
  };

  const dispatchTrip = (tripId) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const vehicle = vehicles.find(v => v.id === trip.vehicleId);
    const driver = drivers.find(d => d.id === trip.driverId);

    // Business Rules checks
    if (!vehicle || !driver) return;
    if (vehicle.status !== 'Available' && vehicle.status !== 'On Trip') {
      addToast(`Vehicle is in ${vehicle.status} mode and cannot dispatch.`, 'danger');
      return;
    }
    if (driver.status !== 'Available' && driver.status !== 'On Trip') {
      addToast(`Driver is ${driver.status} and cannot dispatch.`, 'danger');
      return;
    }
    if (isLicenseExpired(driver.expiryDate)) {
      addToast("Driver license is expired!", 'danger');
      return;
    }

    // Transition state
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'Dispatched' } : t));
    setVehicles(prev => prev.map(v => v.id === vehicle.id ? { ...v, status: 'On Trip' } : v));
    setDrivers(prev => prev.map(d => d.id === driver.id ? { ...d, status: 'On Trip' } : d));

    addToast(`Trip ${trip.tripNo} has been Dispatched! Vehicle & Driver status set to On Trip.`, 'success');
  };

  const completeTrip = (tripId, data) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const vehicle = vehicles.find(v => v.id === trip.vehicleId);
    const endOdometer = Number(data.odometerEnd);
    const fuelVal = Number(data.fuelConsumed);

    if (endOdometer < trip.odometerStart) {
      addToast(`End odometer (${endOdometer}) cannot be less than start odometer (${trip.odometerStart})!`, 'danger');
      return false;
    }

    // Update trip details
    setTrips(prev => prev.map(t => t.id === tripId ? {
      ...t,
      status: 'Completed',
      odometerEnd: endOdometer,
      fuelConsumed: fuelVal
    } : t));

    // Update vehicle odometer and return both driver & vehicle status to Available
    setVehicles(prev => prev.map(v => v.id === trip.vehicleId ? {
      ...v,
      odometer: endOdometer,
      status: 'Available'
    } : v));

    setDrivers(prev => prev.map(d => d.id === trip.driverId ? {
      ...d,
      status: 'Available'
    } : d));

    // Automatically record Fuel Log if fuel consumed was entered
    if (fuelVal > 0) {
      const fuelCost = fuelVal * 2.0; // Simulated fuel rate $2/L
      const newFuelLog = {
        id: 'F' + Date.now(),
        logNo: 'FUEL-' + (300 + fuelLogs.length + 1),
        vehicleId: trip.vehicleId,
        liters: fuelVal,
        cost: fuelCost,
        date: new Date().toISOString().split('T')[0]
      };
      setFuelLogs(prev => [...prev, newFuelLog]);
    }

    addToast(`Trip ${trip.tripNo} marked Completed. Vehicle & Driver returned to Available.`, 'success');
    return true;
  };

  const cancelTrip = (tripId) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'Cancelled' } : t));
    
    // Restore vehicle & driver to Available
    setVehicles(prev => prev.map(v => v.id === trip.vehicleId ? { ...v, status: 'Available' } : v));
    setDrivers(prev => prev.map(d => d.id === trip.driverId ? { ...d, status: 'Available' } : d));

    addToast(`Trip ${trip.tripNo} Cancelled. Vehicle and Driver status restored to Available.`, 'warning');
  };

  // --- MAINTENANCE ACTIONS ---
  const createMaintenance = (maintForm) => {
    const vehicle = vehicles.find(v => v.id === maintForm.vehicleId);
    if (!vehicle) return false;

    if (vehicle.status === 'On Trip') {
      addToast(`Cannot put vehicle ${vehicle.regNo} in shop while on active trip!`, 'danger');
      return false;
    }

    const newMaint = {
      ...maintForm,
      id: 'M' + Date.now(),
      logNo: 'MAINT-' + (200 + maintenance.length + 1),
      cost: Number(maintForm.cost || 0),
      startDate: maintForm.startDate || new Date().toISOString().split('T')[0],
      endDate: null,
      status: 'Open'
    };

    setMaintenance(prev => [...prev, newMaint]);

    // Force vehicle status to 'In Shop'
    setVehicles(prev => prev.map(v => v.id === maintForm.vehicleId ? { ...v, status: 'In Shop' } : v));
    addToast(`Maintenance file ${newMaint.logNo} opened. Vehicle status changed to In Shop.`, 'warning');
    return true;
  };

  const closeMaintenance = (maintId, finalCost) => {
    const log = maintenance.find(m => m.id === maintId);
    if (!log) return;

    // Check if vehicle is retired or restore to Available
    const vehicle = vehicles.find(v => v.id === log.vehicleId);
    const restoredStatus = vehicle && vehicle.status === 'Retired' ? 'Retired' : 'Available';

    setMaintenance(prev => prev.map(m => m.id === maintId ? {
      ...m,
      status: 'Closed',
      cost: Number(finalCost || m.cost),
      endDate: new Date().toISOString().split('T')[0]
    } : m));

    if (vehicle) {
      setVehicles(prev => prev.map(v => v.id === log.vehicleId ? { ...v, status: restoredStatus } : v));
    }

    // Auto-log to expense logs as well
    const newExpense = {
      id: 'E' + Date.now(),
      expenseNo: 'EXP-' + (400 + expenses.length + 1),
      vehicleId: log.vehicleId,
      type: 'Maintenance',
      cost: Number(finalCost || log.cost),
      date: new Date().toISOString().split('T')[0],
      description: `Auto-recorded from Maintenance ${log.logNo}: ${log.description}`
    };
    setExpenses(prev => [...prev, newExpense]);

    addToast(`Maintenance ${log.logNo} completed. Vehicle restored to ${restoredStatus}.`, 'success');
  };

  // --- FUEL ACTIONS ---
  const addFuelLog = (log) => {
    const newLog = {
      ...log,
      id: 'F' + Date.now(),
      logNo: 'FUEL-' + (300 + fuelLogs.length + 1),
      liters: Number(log.liters),
      cost: Number(log.cost),
      date: log.date || new Date().toISOString().split('T')[0]
    };
    setFuelLogs(prev => [...prev, newLog]);
    addToast(`Fuel Log registered for vehicle.`, 'success');
    return true;
  };

  // --- EXPENSE ACTIONS ---
  const addExpense = (exp) => {
    const newExp = {
      ...exp,
      id: 'E' + Date.now(),
      expenseNo: 'EXP-' + (400 + expenses.length + 1),
      cost: Number(exp.cost),
      date: exp.date || new Date().toISOString().split('T')[0]
    };
    setExpenses(prev => [...prev, newExp]);
    addToast(`Expense entry recorded.`, 'success');
    return true;
  };

  // --- STATS / CALCULATIONS ---
  // Operational cost per vehicle
  const getVehicleOperationalCost = (vehicleId) => {
    // Fuel logs cost
    const fuelCost = fuelLogs
      .filter(f => f.vehicleId === vehicleId)
      .reduce((sum, item) => sum + item.cost, 0);

    // Maintenance cost (from closed maintenance logs or expense log filters)
    const maintCost = maintenance
      .filter(m => m.vehicleId === vehicleId)
      .reduce((sum, item) => sum + item.cost, 0);

    // Other expenses logged for this vehicle
    const otherCost = expenses
      .filter(e => e.vehicleId === vehicleId && e.type !== 'Maintenance')
      .reduce((sum, item) => sum + item.cost, 0);

    return fuelCost + maintCost + otherCost;
  };

  return (
    <MockDataContext.Provider value={{
      currentUser,
      setCurrentUser,
      vehicles,
      drivers,
      trips,
      maintenance,
      fuelLogs,
      expenses,
      darkMode,
      setDarkMode,
      toasts,
      addToast,
      isLicenseExpired,
      
      addVehicle,
      updateVehicle,
      deleteVehicle,
      
      addDriver,
      updateDriver,
      deleteDriver,
      
      createTrip,
      dispatchTrip,
      completeTrip,
      cancelTrip,
      
      createMaintenance,
      closeMaintenance,
      
      addFuelLog,
      addExpense,
      
      getVehicleOperationalCost
    }}>
      {children}
    </MockDataContext.Provider>
  );
};
