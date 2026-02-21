# 🚚 FleetFlow  
### Modular Fleet & Logistics Management System

> Replace manual logbooks with a centralized, intelligent, rule-based digital hub.

FleetFlow is a modern fleet & logistics management platform designed to optimize vehicle lifecycle, streamline dispatch operations, improve driver safety, and provide deep financial insights.

---

## ✨ Why FleetFlow?

Managing fleets manually leads to inefficiencies, compliance risks, and hidden operational costs. FleetFlow provides:

✅ Real-time fleet visibility  
✅ Automated validation & safety checks  
✅ Smart asset & driver state management  
✅ Financial and performance analytics  

---

## 🧩 Core Capabilities

### 🔐 Authentication & RBAC
- Secure email/password login via Supabase Auth  
- Role-Based Access Control (Fleet Manager, Dispatcher, Safety Officer, Financial Analyst)

### 📊 Command Center (Dashboard)
At-a-glance operational intelligence:

- **Active Fleet** – Vehicles currently on trip  
- **Maintenance Alerts** – Vehicles in service  
- **Utilization Rate** – Assigned vs idle assets  
- **Pending Cargo** – Unassigned shipments  

Filters by:
- Vehicle Type (Truck / Van / Bike)  
- Status  
- Region  

### 🚐 Vehicle Registry
Manage physical assets:

- Model / Identifier  
- License Plate (Unique)  
- Load Capacity  
- Odometer  
- Status Tracking  
- Out-of-Service Toggle  

### 🗺️ Trip Dispatcher
Efficient trip creation & lifecycle:

- Assign Vehicle + Driver  
- Cargo Weight Validation  

Status Flow:

Draft → Dispatched → Completed → Cancelled

🛑 Prevents invalid trips (overload, unavailable vehicle, expired license)

### 🛠️ Maintenance & Service Logs
- Preventative & reactive maintenance tracking  
- Automatic **“In Shop”** status update  
- Vehicles removed from dispatcher selection pool  

### ⛽ Fuel & Expense Logging
Track operational costs:

- Fuel (Liters, Cost, Date)  
- Maintenance Costs  

Auto-calculations:

- Total Operational Cost  
- Cost per Vehicle  
- Cost per km  

### 👨‍✈️ Driver Performance & Safety
- License Expiry Tracking  
- Duty Status (On Duty / Off Duty / Suspended)  
- Safety Scores  
- Trip Completion Rates  

🚫 Blocks assignment if driver is non-compliant

### 📈 Operational Analytics
Data-driven decisions:

- Fuel Efficiency (km/L)  
- Vehicle ROI  

Formula:

ROI = (Revenue − (Fuel + Maintenance)) / Acquisition Cost

Exports:

- CSV  
- PDF  

---

## ⚙️ Tech Stack

Frontend  
- React 18 + TypeScript  
- Vite  

Styling  
- Tailwind CSS  

UI Components  
- shadcn/ui  

Backend & Database  
- Supabase  
- Supabase Postgres  

---

## 🚀 Getting Started

Clone Repository

```bash
git clone https://github.com/yourusername/fleetflow.git
cd fleetflow
```

Install Dependencies

```bash
npm install
```

Environment Variables  
Create `.env` file:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Run Development Server

```bash
npm run dev
```

---

## 🗄️ Database Overview

Core relational entities:

- vehicles  
- drivers  
- trips  
- maintenance_logs  
- fuel_logs  
- expenses  

Relationships:

Vehicle → Trips → Expenses  
Driver → Trips  
Vehicle → Maintenance Logs  

---

## 🔁 System Workflow

1. Add Vehicle → Status: Available  
2. Add Driver → Compliance Check  
3. Create Trip → Validation Rules  
4. Dispatch → Status Updates  
5. Complete Trip → Odometer Update  
6. Log Fuel / Expenses  
7. Analytics Auto-Refresh  

---

## 🎯 Design Principles

✔ Modular UI  
✔ Scannable data tables  
✔ Real-time state synchronization  
✔ Rule-based validations  
✔ Clean status indicators  

---

## 📂 Suggested Folder Structure

src/  
 ├── components/  
 ├── pages/  
 ├── hooks/  
 ├── services/  
 ├── types/  
 ├── utils/  
 └── App.tsx  

---

## 🛣️ Roadmap

- [ ] Live GPS Tracking  
- [ ] Predictive Maintenance (AI)  
- [ ] Driver Behavior Monitoring  
- [ ] Multi-fleet Support  
- [ ] Mobile App  

---

## 🤝 Contributing

Workflow:

fork → branch → commit → pull request 🚀

---

## 📄 License

MIT License © FleetFlow

---

## 💡 Vision

FleetFlow aims to become the **operating system for logistics fleets** — combining operations, safety, and finance into one intelligent platform.
