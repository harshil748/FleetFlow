// Mock data for FleetFlow fleet management system

export const mockVehicles = [
  { id: 1, plate: "FLT-001", model: "Volvo FH16", type: "Heavy Truck", capacity: "25 tons", odometer: 142500, status: "Active" },
  { id: 2, plate: "FLT-002", model: "Scania R450", type: "Trailer", capacity: "20 tons", odometer: 98300, status: "Active" },
  { id: 3, plate: "FLT-003", model: "MAN TGX", type: "Tanker", capacity: "18 tons", odometer: 210000, status: "Maintenance" },
  { id: 4, plate: "FLT-004", model: "DAF XF", type: "Flatbed", capacity: "22 tons", odometer: 76200, status: "Active" },
  { id: 5, plate: "FLT-005", model: "Mercedes Actros", type: "Refrigerated", capacity: "15 tons", odometer: 183400, status: "Idle" },
  { id: 6, plate: "FLT-006", model: "Iveco Stralis", type: "Container", capacity: "28 tons", odometer: 55000, status: "Active" },
  { id: 7, plate: "FLT-007", model: "Kenworth T680", type: "Heavy Truck", capacity: "30 tons", odometer: 320100, status: "Maintenance" },
];

export const mockTrips = [
  { id: "TRP-1001", vehicle: "FLT-001", fleetType: "Heavy Truck", driver: "James Wilson", origin: "Los Angeles, CA", destination: "Phoenix, AZ", status: "In Transit", cargo: "12 tons" },
  { id: "TRP-1002", vehicle: "FLT-002", driver: "Sarah Chen", fleetType: "Trailer", origin: "Houston, TX", destination: "Dallas, TX", status: "Completed", cargo: "8 tons" },
  { id: "TRP-1003", vehicle: "FLT-004", driver: "Mike Roberts", fleetType: "Flatbed", origin: "Chicago, IL", destination: "Detroit, MI", status: "Pending", cargo: "15 tons" },
  { id: "TRP-1004", vehicle: "FLT-006", driver: "Ana Garcia", fleetType: "Container", origin: "Miami, FL", destination: "Atlanta, GA", status: "In Transit", cargo: "20 tons" },
  { id: "TRP-1005", vehicle: "FLT-001", driver: "James Wilson", fleetType: "Heavy Truck", origin: "Seattle, WA", destination: "Portland, OR", status: "Completed", cargo: "10 tons" },
  { id: "TRP-1006", vehicle: "FLT-005", driver: "Tom Baker", fleetType: "Refrigerated", origin: "Denver, CO", destination: "Salt Lake City, UT", status: "Pending", cargo: "6 tons" },
];

export const mockDrivers = [
  { id: 1, name: "James Wilson", license: "CDL-A-88421", expiry: "2025-08-15", completionRate: 96, safetyScore: 92, complaints: 1 },
  { id: 2, name: "Sarah Chen", license: "CDL-A-77302", expiry: "2026-03-22", completionRate: 99, safetyScore: 98, complaints: 0 },
  { id: 3, name: "Mike Roberts", license: "CDL-B-55190", expiry: "2025-04-10", completionRate: 88, safetyScore: 85, complaints: 3 },
  { id: 4, name: "Ana Garcia", license: "CDL-A-66478", expiry: "2026-11-30", completionRate: 94, safetyScore: 90, complaints: 1 },
  { id: 5, name: "Tom Baker", license: "CDL-A-99201", expiry: "2025-06-05", completionRate: 91, safetyScore: 87, complaints: 2 },
  { id: 6, name: "Lisa Park", license: "CDL-B-44310", expiry: "2027-01-18", completionRate: 97, safetyScore: 95, complaints: 0 },
];

export const mockMaintenance = [
  { id: "MNT-001", vehicle: "FLT-003", issue: "Engine overhaul", date: "2026-02-10", cost: 4500, status: "In Progress" },
  { id: "MNT-002", vehicle: "FLT-007", issue: "Brake pad replacement", date: "2026-02-08", cost: 1200, status: "Completed" },
  { id: "MNT-003", vehicle: "FLT-001", issue: "Tire rotation", date: "2026-02-15", cost: 800, status: "Scheduled" },
  { id: "MNT-004", vehicle: "FLT-005", issue: "Coolant system flush", date: "2026-02-12", cost: 650, status: "Completed" },
  { id: "MNT-005", vehicle: "FLT-003", issue: "Transmission repair", date: "2026-02-18", cost: 3200, status: "Scheduled" },
];

export const mockExpenses = [
  { id: "TRP-1001", driver: "James Wilson", distance: 370, fuelExpense: 420, miscExpense: 85, status: "Approved" },
  { id: "TRP-1002", driver: "Sarah Chen", distance: 240, fuelExpense: 280, miscExpense: 45, status: "Approved" },
  { id: "TRP-1003", driver: "Mike Roberts", distance: 280, fuelExpense: 310, miscExpense: 120, status: "Pending" },
  { id: "TRP-1004", driver: "Ana Garcia", distance: 660, fuelExpense: 750, miscExpense: 200, status: "In Review" },
  { id: "TRP-1005", driver: "James Wilson", distance: 175, fuelExpense: 195, miscExpense: 30, status: "Approved" },
  { id: "TRP-1006", driver: "Tom Baker", distance: 525, fuelExpense: 590, miscExpense: 150, status: "Pending" },
];

export const mockAnalytics = {
  totalFuelCost: 28450,
  fleetROI: 18.4,
  utilizationRate: 78,
  fuelEfficiency: [
    { month: "Sep", mpg: 6.2 },
    { month: "Oct", mpg: 6.5 },
    { month: "Nov", mpg: 6.1 },
    { month: "Dec", mpg: 5.9 },
    { month: "Jan", mpg: 6.3 },
    { month: "Feb", mpg: 6.7 },
  ],
  costliestVehicles: [
    { vehicle: "FLT-003", cost: 8200 },
    { vehicle: "FLT-007", cost: 6100 },
    { vehicle: "FLT-001", cost: 4800 },
    { vehicle: "FLT-004", cost: 3900 },
    { vehicle: "FLT-006", cost: 3200 },
  ],
  financials: [
    { month: "Sep", revenue: 45000, fuelCost: 4200, maintenance: 1800, netProfit: 39000 },
    { month: "Oct", revenue: 52000, fuelCost: 4800, maintenance: 2200, netProfit: 45000 },
    { month: "Nov", revenue: 48000, fuelCost: 4500, maintenance: 3500, netProfit: 40000 },
    { month: "Dec", revenue: 41000, fuelCost: 3900, maintenance: 1200, netProfit: 35900 },
    { month: "Jan", revenue: 55000, fuelCost: 5100, maintenance: 2800, netProfit: 47100 },
    { month: "Feb", revenue: 58000, fuelCost: 5400, maintenance: 3000, netProfit: 49600 },
  ],
};

export const getStatusColor = (status: string) => {
  const s = status.toLowerCase();
  if (["active", "completed", "approved"].includes(s)) return "status-active";
  if (["maintenance", "in progress", "in review", "in transit"].includes(s)) return "status-warning";
  if (["idle", "pending", "scheduled"].includes(s)) return "status-info";
  return "status-danger";
};
