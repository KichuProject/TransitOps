export const INITIAL_USERS = [
  { email: 'manager@transitops.com', password: 'password123', name: 'Frank Miller', role: 'Fleet Manager', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100' },
  { email: 'dispatcher@transitops.com', password: 'password123', name: 'Alex Johnson', role: 'Dispatcher', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
  { email: 'safety@transitops.com', password: 'password123', name: 'Sarah Connor', role: 'Safety Officer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
  { email: 'finance@transitops.com', password: 'password123', name: 'David Vance', role: 'Financial Analyst', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' }
];

export const INITIAL_VEHICLES = [
  { id: 'V1', regNo: 'Van-05', name: 'Ford Transit 2022', type: 'Van', maxCapacity: 500, odometer: 12000, acquisitionCost: 35000, status: 'Available', region: 'North' },
  { id: 'V2', regNo: 'Truck-12', name: 'Volvo FH16 Heavy Duty', type: 'Heavy Truck', maxCapacity: 15000, odometer: 85000, acquisitionCost: 120000, status: 'Available', region: 'South' },
  { id: 'V3', regNo: 'Semi-01', name: 'Peterbilt 389', type: 'Semi-Trailer', maxCapacity: 20000, odometer: 145000, acquisitionCost: 150000, status: 'On Trip', region: 'East' },
  { id: 'V4', regNo: 'Pick-03', name: 'Ford F-150 Raptor', type: 'Pickup', maxCapacity: 1000, odometer: 34000, acquisitionCost: 45000, status: 'In Shop', region: 'West' },
  { id: 'V5', regNo: 'Van-01', name: 'Mercedes Sprinter Cargo', type: 'Van', maxCapacity: 800, odometer: 180000, acquisitionCost: 28000, status: 'Retired', region: 'North' }
];

export const INITIAL_DRIVERS = [
  { id: 'D1', name: 'Alex Johnson', licenseNo: 'DL-88492', category: 'Class A', expiryDate: '2027-10-15', contact: '+1 555-0192', safetyScore: 95, status: 'Available' },
  { id: 'D2', name: 'John Doe', licenseNo: 'DL-12345', category: 'Class A', expiryDate: '2028-04-20', contact: '+1 555-0143', safetyScore: 88, status: 'On Trip' },
  { id: 'D3', name: 'Marcus Aurelius', licenseNo: 'DL-54321', category: 'Class B', expiryDate: '2026-03-01', contact: '+1 555-0167', safetyScore: 72, status: 'Available' }, // expired
  { id: 'D4', name: 'Sarah Jenkins', licenseNo: 'DL-99887', category: 'Class A', expiryDate: '2027-01-12', contact: '+1 555-0112', safetyScore: 45, status: 'Suspended' },
  { id: 'D5', name: 'Bob Smith', licenseNo: 'DL-11223', category: 'Class C', expiryDate: '2029-06-30', contact: '+1 555-0125', safetyScore: 90, status: 'Off Duty' }
];

export const INITIAL_TRIPS = [
  { id: 'T1', tripNo: 'TRIP-101', source: 'Chicago IL', destination: 'Detroit MI', vehicleId: 'V3', driverId: 'D2', cargoWeight: 12000, distance: 280, status: 'Dispatched', date: '2026-07-11', odometerStart: 144720, odometerEnd: null, fuelConsumed: null },
  { id: 'T2', tripNo: 'TRIP-102', source: 'New York NY', destination: 'Boston MA', vehicleId: 'V1', driverId: 'D1', cargoWeight: 300, distance: 215, status: 'Completed', date: '2026-07-10', odometerStart: 11785, odometerEnd: 12000, fuelConsumed: 22 },
  { id: 'T3', tripNo: 'TRIP-103', source: 'Houston TX', destination: 'Dallas TX', vehicleId: 'V2', driverId: 'D5', cargoWeight: 4500, distance: 240, status: 'Draft', date: '2026-07-12', odometerStart: 85000, odometerEnd: null, fuelConsumed: null }
];

export const INITIAL_MAINTENANCE = [
  { id: 'M1', logNo: 'MAINT-201', vehicleId: 'V4', description: 'Transmission System Rebuild', cost: 1200, startDate: '2026-07-08', endDate: null, status: 'Open' },
  { id: 'M2', logNo: 'MAINT-202', vehicleId: 'V1', description: 'Oil Change & Filter replacement', cost: 120, startDate: '2026-07-05', endDate: '2026-07-06', status: 'Closed' }
];

export const INITIAL_FUEL = [
  { id: 'F1', logNo: 'FUEL-301', vehicleId: 'V3', liters: 120, cost: 240, date: '2026-07-10' },
  { id: 'F2', logNo: 'FUEL-302', vehicleId: 'V1', liters: 22, cost: 44, date: '2026-07-10' }
];

export const INITIAL_EXPENSES = [
  { id: 'E1', expenseNo: 'EXP-401', vehicleId: 'V3', type: 'Tolls', cost: 45, date: '2026-07-11', description: 'I-90 Express toll road' },
  { id: 'E2', expenseNo: 'EXP-402', vehicleId: 'V1', type: 'Meal/Lodging', cost: 25, date: '2026-07-10', description: 'Driver rest stop lunch' },
  { id: 'E3', expenseNo: 'EXP-403', vehicleId: 'V4', type: 'Parts', cost: 300, date: '2026-07-08', description: 'Transmission gasket set' }
];
