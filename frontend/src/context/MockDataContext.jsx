import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useDashboard } from './DashboardContext';
import { toast } from 'react-hot-toast';
import vehicleApi from '../api/vehicle';
import driverApi from '../api/driver';
import tripApi from '../api/trip';
import maintenanceApi from '../api/maintenance';
import fuelApi from '../api/fuel';
import expenseApi from '../api/expense';

import {
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_TRIPS,
  INITIAL_MAINTENANCE,
  INITIAL_FUEL,
  INITIAL_EXPENSES
} from '../constants/mockData';

// FLAG TO TOGGLE LOCAL PREVIEW MODE VS LIVE REST BACKEND
const USE_BACKEND_API = true;

const MockDataContext = createContext();

export const useMockData = () => useContext(MockDataContext);

export const MockDataProvider = ({ children }) => {
  const { currentUser, setCurrentUser } = useAuth() || {};
  const { fetchDashboardData } = useDashboard() || {};

  const [vehicles, setVehicles] = useState(() => {
    if (!USE_BACKEND_API) {
      const saved = localStorage.getItem('to_vehicles');
      return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    }
    return [];
  });

  const [drivers, setDrivers] = useState(() => {
    if (!USE_BACKEND_API) {
      const saved = localStorage.getItem('to_drivers');
      return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
    }
    return [];
  });

  const [trips, setTrips] = useState(() => {
    if (!USE_BACKEND_API) {
      const saved = localStorage.getItem('to_trips');
      return saved ? JSON.parse(saved) : INITIAL_TRIPS;
    }
    return [];
  });

  const [maintenance, setMaintenance] = useState(() => {
    if (!USE_BACKEND_API) {
      const saved = localStorage.getItem('to_maintenance');
      return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
    }
    return [];
  });

  const [fuelLogs, setFuelLogs] = useState(() => {
    if (!USE_BACKEND_API) {
      const saved = localStorage.getItem('to_fuel');
      return saved ? JSON.parse(saved) : INITIAL_FUEL;
    }
    return [];
  });

  const [expenses, setExpenses] = useState(() => {
    if (!USE_BACKEND_API) {
      const saved = localStorage.getItem('to_expenses');
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    }
    return [];
  });

  const [loading, setLoading] = useState(false);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('to_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  // Sync dark mode
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

  // Sync local states to localStorage when in preview mode
  useEffect(() => {
    if (!USE_BACKEND_API) {
      localStorage.setItem('to_vehicles', JSON.stringify(vehicles));
    }
  }, [vehicles]);

  useEffect(() => {
    if (!USE_BACKEND_API) {
      localStorage.setItem('to_drivers', JSON.stringify(drivers));
    }
  }, [drivers]);

  useEffect(() => {
    if (!USE_BACKEND_API) {
      localStorage.setItem('to_trips', JSON.stringify(trips));
    }
  }, [trips]);

  useEffect(() => {
    if (!USE_BACKEND_API) {
      localStorage.setItem('to_maintenance', JSON.stringify(maintenance));
    }
  }, [maintenance]);

  useEffect(() => {
    if (!USE_BACKEND_API) {
      localStorage.setItem('to_fuel', JSON.stringify(fuelLogs));
    }
  }, [fuelLogs]);

  useEffect(() => {
    if (!USE_BACKEND_API) {
      localStorage.setItem('to_expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  // Alert/Toast compatibility layer
  const addToast = useCallback((message, type = 'success') => {
    if (type === 'success') toast.success(message);
    else if (type === 'danger' || type === 'error') toast.error(message);
    else if (type === 'warning') toast(message, { icon: '⚠️' });
    else if (type === 'info') toast(message, { icon: 'ℹ️' });
    else toast(message);
  }, []);

  // Helper date checker for driving licenses
  const isLicenseExpired = (expiryDate) => {
    const today = new Date('2026-07-12'); // Fixed hackathon date
    return new Date(expiryDate) < today;
  };

  // Central function to fetch all lists
  const refreshAllData = useCallback(async () => {
    if (!currentUser) return;
    if (!USE_BACKEND_API) {
      // Local preview mode: trigger dashboard mock update if provider exists
      if (fetchDashboardData) {
        fetchDashboardData();
      }
      return;
    }
    setLoading(true);
    try {
      const [v, d, t, m, f, e] = await Promise.all([
        vehicleApi.getAll().catch(() => []),
        driverApi.getAll().catch(() => []),
        tripApi.getAll().catch(() => []),
        maintenanceApi.getAll().catch(() => []),
        fuelApi.getAll().catch(() => []),
        expenseApi.getAll().catch(() => [])
      ]);

      setVehicles(v);
      setDrivers(d);
      setTrips(t);
      setMaintenance(m);
      setFuelLogs(f);
      setExpenses(e);

      if (fetchDashboardData) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to fetch data lists:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, fetchDashboardData]);

  // Refresh lists on login or profile reload
  useEffect(() => {
    if (currentUser) {
      refreshAllData();
    } else {
      // Clear data if logged out in backend mode, reset to initial in local mode
      if (USE_BACKEND_API) {
        setVehicles([]);
        setDrivers([]);
        setTrips([]);
        setMaintenance([]);
        setFuelLogs([]);
        setExpenses([]);
      }
    }
  }, [currentUser, refreshAllData]);

  // --- VEHICLE ACTIONS ---
  const addVehicle = async (newVehicle) => {
    if (USE_BACKEND_API) {
      try {
        await vehicleApi.create({
          ...newVehicle,
          maxCapacity: Number(newVehicle.maxCapacity),
          odometer: Number(newVehicle.odometer),
          acquisitionCost: Number(newVehicle.acquisitionCost)
        });
        await refreshAllData();
        addToast(`Vehicle ${newVehicle.regNo} registered successfully!`, 'success');
        return true;
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to register vehicle';
        addToast(errMsg, 'danger');
        return false;
      }
    } else {
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
    }
  };

  const updateVehicle = async (updated) => {
    if (USE_BACKEND_API) {
      try {
        await vehicleApi.update(updated.id, {
          ...updated,
          maxCapacity: Number(updated.maxCapacity),
          odometer: Number(updated.odometer),
          acquisitionCost: Number(updated.acquisitionCost)
        });
        await refreshAllData();
        addToast(`Vehicle ${updated.regNo} updated!`, 'success');
        return true;
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to update vehicle';
        addToast(errMsg, 'danger');
        return false;
      }
    } else {
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
    }
  };

  const deleteVehicle = async (id) => {
    if (USE_BACKEND_API) {
      try {
        await vehicleApi.delete(id);
        await refreshAllData();
        addToast(`Vehicle removed from registry.`, 'warning');
        return true;
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to delete vehicle';
        addToast(errMsg, 'danger');
        return false;
      }
    } else {
      const vehicle = vehicles.find(v => v.id === id);
      if (!vehicle) return false;
      if (vehicle.status === 'On Trip') {
        addToast(`Cannot delete Vehicle ${vehicle.regNo} while it is On Trip!`, 'danger');
        return false;
      }
      setVehicles(prev => prev.filter(v => v.id !== id));
      addToast(`Vehicle ${vehicle.regNo} removed from registry.`, 'warning');
      return true;
    }
  };

  // --- DRIVER ACTIONS ---
  const addDriver = async (newDriver) => {
    if (USE_BACKEND_API) {
      try {
        await driverApi.create({
          ...newDriver,
          safetyScore: Number(newDriver.safetyScore || 100)
        });
        await refreshAllData();
        addToast(`Driver ${newDriver.name} profile created!`, 'success');
        return true;
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to create driver profile';
        addToast(errMsg, 'danger');
        return false;
      }
    } else {
      const driver = {
        ...newDriver,
        id: 'D' + (Date.now()),
        safetyScore: Number(newDriver.safetyScore || 100),
        status: newDriver.status || 'Available'
      };
      setDrivers(prev => [...prev, driver]);
      addToast(`Driver ${driver.name} profile created!`, 'success');
      return true;
    }
  };

  const updateDriver = async (updated) => {
    if (USE_BACKEND_API) {
      try {
        await driverApi.update(updated.id, {
          ...updated,
          safetyScore: Number(updated.safetyScore)
        });
        await refreshAllData();
        addToast(`Driver ${updated.name} profile updated!`, 'success');
        return true;
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to update driver profile';
        addToast(errMsg, 'danger');
        return false;
      }
    } else {
      setDrivers(prev => prev.map(d => d.id === updated.id ? {
        ...updated,
        safetyScore: Number(updated.safetyScore)
      } : d));
      addToast(`Driver ${updated.name} profile updated!`, 'success');
      return true;
    }
  };

  const deleteDriver = async (id) => {
    if (USE_BACKEND_API) {
      try {
        await driverApi.delete(id);
        await refreshAllData();
        addToast(`Driver profile removed.`, 'warning');
        return true;
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to delete driver profile';
        addToast(errMsg, 'danger');
        return false;
      }
    } else {
      const driver = drivers.find(d => d.id === id);
      if (!driver) return false;
      if (driver.status === 'On Trip') {
        addToast(`Cannot delete Driver ${driver.name} while on an active trip!`, 'danger');
        return false;
      }
      setDrivers(prev => prev.filter(d => d.id !== id));
      addToast(`Driver ${driver.name} profile removed.`, 'warning');
      return true;
    }
  };

  // --- TRIP ACTIONS ---
  const createTrip = async (tripForm) => {
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

    if (USE_BACKEND_API) {
      try {
        await tripApi.create({
          ...tripForm,
          cargoWeight: Number(tripForm.cargoWeight),
          distance: Number(tripForm.distance),
          date: new Date('2026-07-12').toISOString().split('T')[0]
        });
        await refreshAllData();
        addToast(`Trip draft created successfully!`, 'success');
        return true;
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to create trip';
        addToast(errMsg, 'danger');
        return false;
      }
    } else {
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
    }
  };

  const dispatchTrip = async (tripId) => {
    if (USE_BACKEND_API) {
      try {
        await tripApi.dispatchTrip(tripId);
        await refreshAllData();
        addToast(`Trip has been Dispatched! Vehicle & Driver status set to On Trip.`, 'success');
        return true;
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to dispatch trip';
        addToast(errMsg, 'danger');
        return false;
      }
    } else {
      const trip = trips.find(t => t.id === tripId);
      if (!trip) return false;

      const vehicle = vehicles.find(v => v.id === trip.vehicleId);
      const driver = drivers.find(d => d.id === trip.driverId);
      if (!vehicle || !driver) return false;

      setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'Dispatched' } : t));
      setVehicles(prev => prev.map(v => v.id === vehicle.id ? { ...v, status: 'On Trip' } : v));
      setDrivers(prev => prev.map(d => d.id === driver.id ? { ...d, status: 'On Trip' } : d));
      addToast(`Trip ${trip.tripNo} has been Dispatched! Vehicle & Driver status set to On Trip.`, 'success');
      return true;
    }
  };

  const completeTrip = async (tripId, data) => {
    if (USE_BACKEND_API) {
      try {
        await tripApi.completeTrip(tripId, {
          odometerEnd: Number(data.odometerEnd),
          fuelConsumed: Number(data.fuelConsumed)
        });
        await refreshAllData();
        addToast(`Trip marked Completed. Vehicle & Driver returned to Available.`, 'success');
        return true;
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to complete trip';
        addToast(errMsg, 'danger');
        return false;
      }
    } else {
      const trip = trips.find(t => t.id === tripId);
      if (!trip) return false;

      const vehicle = vehicles.find(v => v.id === trip.vehicleId);
      const endOdometer = Number(data.odometerEnd);
      const fuelVal = Number(data.fuelConsumed);

      if (endOdometer < trip.odometerStart) {
        addToast(`End odometer (${endOdometer}) cannot be less than start odometer (${trip.odometerStart})!`, 'danger');
        return false;
      }

      setTrips(prev => prev.map(t => t.id === tripId ? {
        ...t,
        status: 'Completed',
        odometerEnd: endOdometer,
        fuelConsumed: fuelVal
      } : t));

      setVehicles(prev => prev.map(v => v.id === trip.vehicleId ? {
        ...v,
        odometer: endOdometer,
        status: 'Available'
      } : v));

      setDrivers(prev => prev.map(d => d.id === trip.driverId ? {
        ...d,
        status: 'Available'
      } : d));

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
    }
  };

  const cancelTrip = async (tripId) => {
    if (USE_BACKEND_API) {
      try {
        await tripApi.cancelTrip(tripId);
        await refreshAllData();
        addToast(`Trip Cancelled. Vehicle and Driver status restored to Available.`, 'warning');
        return true;
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to cancel trip';
        addToast(errMsg, 'danger');
        return false;
      }
    } else {
      const trip = trips.find(t => t.id === tripId);
      if (!trip) return false;

      setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'Cancelled' } : t));
      setVehicles(prev => prev.map(v => v.id === trip.vehicleId ? { ...v, status: 'Available' } : v));
      setDrivers(prev => prev.map(d => d.id === trip.driverId ? { ...d, status: 'Available' } : d));
      addToast(`Trip ${trip.tripNo} Cancelled. Vehicle and Driver status restored to Available.`, 'warning');
      return true;
    }
  };

  // --- MAINTENANCE ACTIONS ---
  const createMaintenance = async (maintForm) => {
    const vehicle = vehicles.find(v => v.id === maintForm.vehicleId);
    if (!vehicle) return false;

    if (vehicle.status === 'On Trip') {
      addToast(`Cannot put vehicle ${vehicle.regNo} in shop while on active trip!`, 'danger');
      return false;
    }

    if (USE_BACKEND_API) {
      try {
        await maintenanceApi.create({
          ...maintForm,
          cost: Number(maintForm.cost || 0),
          startDate: maintForm.startDate || new Date().toISOString().split('T')[0]
        });
        await refreshAllData();
        addToast(`Maintenance file opened. Vehicle status changed to In Shop.`, 'warning');
        return true;
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to create maintenance entry';
        addToast(errMsg, 'danger');
        return false;
      }
    } else {
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
      setVehicles(prev => prev.map(v => v.id === maintForm.vehicleId ? { ...v, status: 'In Shop' } : v));
      addToast(`Maintenance file ${newMaint.logNo} opened. Vehicle status changed to In Shop.`, 'warning');
      return true;
    }
  };

  const closeMaintenance = async (maintId, finalCost) => {
    if (USE_BACKEND_API) {
      try {
        await maintenanceApi.closeMaintenance(maintId, Number(finalCost));
        await refreshAllData();
        addToast(`Maintenance completed. Vehicle status restored.`, 'success');
        return true;
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to close maintenance';
        addToast(errMsg, 'danger');
        return false;
      }
    } else {
      const log = maintenance.find(m => m.id === maintId);
      if (!log) return false;

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
      return true;
    }
  };

  // --- FUEL ACTIONS ---
  const addFuelLog = async (log) => {
    if (USE_BACKEND_API) {
      try {
        await fuelApi.create({
          ...log,
          liters: Number(log.liters),
          cost: Number(log.cost),
          date: log.date || new Date().toISOString().split('T')[0]
        });
        await refreshAllData();
        addToast(`Fuel Log registered for vehicle.`, 'success');
        return true;
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to register fuel log';
        addToast(errMsg, 'danger');
        return false;
      }
    } else {
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
    }
  };

  // --- EXPENSE ACTIONS ---
  const addExpense = async (exp) => {
    if (USE_BACKEND_API) {
      try {
        await expenseApi.create({
          ...exp,
          cost: Number(exp.cost),
          date: exp.date || new Date().toISOString().split('T')[0]
        });
        await refreshAllData();
        addToast(`Expense entry recorded.`, 'success');
        return true;
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to record expense';
        addToast(errMsg, 'danger');
        return false;
      }
    } else {
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
    }
  };

  // --- STATS / CALCULATIONS ---
  const getVehicleOperationalCost = (vehicleId) => {
    const fuelCost = fuelLogs
      .filter(f => f.vehicleId === vehicleId)
      .reduce((sum, item) => sum + item.cost, 0);

    const maintCost = maintenance
      .filter(m => m.vehicleId === vehicleId)
      .reduce((sum, item) => sum + item.cost, 0);

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
      toasts: [],
      addToast,
      isLicenseExpired,
      loading,
      refreshAllData,

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
