# 🚚 FleetFlow

### Modular Fleet & Logistics Management System

> Replace manual logbooks with a centralized, intelligent, rule-based digital hub.

FleetFlow is a modern fleet & logistics management platform designed to optimize vehicle lifecycle, streamline dispatch operations, improve driver safety, and provide deep financial insights.

**🌐 Live Demo:** [https://fleet-flow-pi.vercel.app/](https://fleet-flow-pi.vercel.app/)

---

## ✨ Why FleetFlow?

Managing fleets manually leads to inefficiencies, compliance risks, and hidden operational costs. FleetFlow provides:

✅ Real-time fleet visibility  
✅ Automated validation & safety checks  
✅ Smart asset & driver state management  
✅ Financial and performance analytics

---

## 🧩 Core Capabilities

### 🔐 Authentication & Security

- Secure email/password authentication via Supabase Auth
- Protected routes with automatic session management
- Real-time session validation

### 📊 Command Center (Dashboard)

At-a-glance operational intelligence:

- **Active Fleet** – Vehicles currently on trip
- **Maintenance Alerts** – Vehicles in service (in_shop status)
- **Pending Cargo** – Unassigned shipments (draft trips)
- **Recent Trips** – Latest 5 trip activities with vehicle and driver details
- **Real-time Updates** – Live data synchronization via Supabase subscriptions

### 🚐 Vehicle Registry

Comprehensive vehicle asset management:

- **Add/View Vehicles** – Create new vehicle entries
- **Vehicle Details** – Model/name, license plate (unique), type (truck/van/bike)
- **Capacity Tracking** – Max payload capacity
- **Odometer Management** – Current mileage tracking
- **Status Management** – Available, On Trip, In Shop, Unavailable
- **Glass Morphism UI** – Modern, clean interface

### 👥 Driver Registry

Full driver lifecycle management with CRUD operations:

- **Add New Drivers** – Register drivers with complete profile
- **Edit Driver Info** – Update driver details (license number locked after creation)
- **Delete/Suspend** – Remove or temporarily suspend drivers
- **License Management** – License number, expiry date, vehicle type certifications
- **Multi-Vehicle Certification** – Assign multiple allowed vehicle types (truck/van/bike)
- **Status Tracking** – On Duty, Off Duty, On Trip, Suspended
- **Compliance Alerts** – Warning banner for licenses expiring within 90 days
- **Search & Filter** – Quick search by name or license number, filter by status
- **Safety Scores** – View driver safety ratings

### 🗺️ Trip Dispatcher

Efficient trip creation & lifecycle management:

- **Quick Dispatch** – Assign vehicle + driver with cargo weight
- **Payload Validation** – Prevents overweight cargo assignments
- **Driver Compliance** – Blocks assignment if license expired
- **Vehicle Availability** – Only shows available/on-trip vehicles

**Trip Status Flow:**  
Draft → Dispatched → Completed → Cancelled

- **Complete Trips** – Record end odometer reading
- **Automatic Status Updates** – Vehicle and driver status sync
- **Real-time Trip Table** – View all trips with vehicle/driver details

### 🛠️ Maintenance & Service Logs

Comprehensive maintenance tracking:

- **Service Records** – Log maintenance type, cost, and details
- **Automatic Status Sync** – Sets vehicle to "In Shop" during maintenance
- **Service History** – Complete maintenance timeline per vehicle
- **Cost Tracking** – Maintenance expense monitoring
- **Availability Control** – In-shop vehicles excluded from dispatch

### ⛽ Trip & Expense Management

Track all operational costs:

- **Fuel Logging** – Record liters, cost, and date per vehicle
- **Expense Tracking** – Comprehensive fuel cost monitoring
- **Per-Vehicle Analysis** – Cost breakdown by vehicle
- **Timeline View** – Chronological expense logs with vehicle details

### 📈 Driver Performance & Safety Analytics

Read-only performance monitoring dashboard:

- **Safety Score Visualization** – Color-coded badges (95+ Excellent, 85-94 Good, <85 Needs Improvement)
- **Trip Completion Rates** – Visual progress bars with percentage
- **Completion Metrics** – Completed trips vs total trips per driver
- **License Expiry Tracking** – 90-day warning system with day countdown
- **Advanced Filtering** – Filter by status (on_duty, on_trip, off_duty, suspended)
- **Multi-Sort Options** – Sort by safety score, completion rate, expiry date, or name
- **Intelligent Grouping** – Group by:
  - Driver Status
  - Vehicle Type Certification
  - Performance Score Band (Excellent/Good/Needs Improvement)
- **Analytics Focus** – Pure performance monitoring, no data editing
- **Quick Access** – "Manage Drivers" button links directly to Driver Registry

### 📊 Operational Analytics

Data-driven decision making:

- **Financial Overview** – Total fuel costs, maintenance costs, ROI calculations
- **Fleet Utilization** – Active vehicles vs total fleet percentage
- **Fuel Efficiency Charts** – Monthly trend analysis with line graphs
- **Cost Analysis** – Costliest vehicles breakdown with bar charts
- **Revenue vs Expenses** – Profit margin visualization
- **Interactive Graphs** – Hover details powered by Recharts

**ROI Formula:**

```
ROI = (Revenue − (Fuel + Maintenance)) / Acquisition Cost × 100%
```

---

## ⚙️ Tech Stack

**Frontend**

- React 18 + TypeScript
- Vite
- React Router v6

**Styling**

- Tailwind CSS
- Custom Glass Morphism UI

**UI Components**

- shadcn/ui
- Lucide React Icons
- Recharts (Analytics Visualization)
- Sonner (Toast Notifications)

**Backend & Database**

- Supabase Auth
- Supabase Postgres
- Real-time Subscriptions

**Deployment**

- Vercel
- Automatic CI/CD

---

## 🚀 Getting Started

Clone Repository

```bash
git clone https://github.com/harshil748/FleetFlow1.git
cd FleetFlow1
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

- **vehicles** – Fleet assets with status tracking
- **drivers** – Driver profiles with compliance data
- **trips** – Trip records with vehicle and driver assignments
- **maintenance_logs** – Service history per vehicle
- **fuel_logs** – Fuel consumption and costs

**Relationships:**

```
Vehicle → Trips → Driver
Vehicle → Maintenance Logs
Vehicle → Fuel Logs
Driver → Trips
```

---

## 🔁 System Workflow

1. **Register Vehicle** → Status: Available
2. **Register Driver** → Compliance Check (License expiry, vehicle types)
3. **Create Trip** → Validation Rules (payload, driver status, vehicle availability)
4. **Dispatch** → Status Updates (Vehicle: on_trip, Driver: on_trip)
5. **Complete Trip** → Odometer Update, Status Reset
6. **Log Expenses** → Fuel/Maintenance tracking
7. **View Analytics** → Auto-refresh with real-time data

---

## 🎯 Design Principles

✔ **Modular UI** – Clean separation of concerns across pages  
✔ **Scannable Tables** – Quick data parsing with status indicators  
✔ **Real-time Sync** – Instant updates via Supabase subscriptions  
✔ **Rule-based Validation** – Prevent invalid operations before they happen  
✔ **Glass Morphism** – Modern, professional aesthetic

---

## 📂 Project Structure

```
src/
 ├── components/          # Reusable UI components
 │   ├── ui/             # shadcn/ui components
 │   ├── AppSidebar.tsx  # Navigation sidebar
 │   ├── DashboardLayout.tsx
 │   ├── ProtectedRoute.tsx
 │   ├── StatusPill.tsx
 │   └── Toolbar.tsx
 ├── pages/              # Route pages
 │   ├── Auth.tsx        # Login/Signup
 │   ├── Dashboard.tsx   # Command center
 │   ├── Vehicles.tsx    # Vehicle registry
 │   ├── Drivers.tsx     # Driver registry (CRUD)
 │   ├── Trips.tsx       # Trip dispatcher
 │   ├── Maintenance.tsx # Maintenance logs
 │   ├── Expenses.tsx    # Fuel & expenses
 │   ├── Performance.tsx # Driver analytics
 │   └── Analytics.tsx   # Operational analytics
 ├── hooks/              # Custom React hooks
 ├── lib/                # Utilities
 │   ├── supabaseClient.ts
 │   └── utils.ts
 ├── integrations/       # Third-party integrations
 └── App.tsx             # Main app component
```

---

## 🛣️ Roadmap

- [ ] Live GPS Tracking
- [ ] Predictive Maintenance (AI/ML)
- [ ] Driver Behavior Monitoring
- [ ] Multi-fleet Support
- [ ] Mobile App (React Native)
- [ ] Export Reports (CSV/PDF)
- [ ] Role-Based Access Control (RBAC)
- [ ] Push Notifications

---

## 🤝 Contributing

Contributions are welcome! Please follow this workflow:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License © 2026 FleetFlow

---

## 💡 Vision

FleetFlow aims to become the **operating system for logistics fleets** — combining operations, safety, and finance into one intelligent platform.

---

## 📧 Contact

**Developer:** Harshil Patel  
**Repository:** [github.com/harshil748/FleetFlow1](https://github.com/harshil748/FleetFlow1)  
**Live Demo:** [fleet-flow-pi.vercel.app](https://fleet-flow-pi.vercel.app/)
