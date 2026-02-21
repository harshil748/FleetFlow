

# Fleet Management System — "FleetFlow"

## Overview
A comprehensive fleet management dashboard application with a dark neon/glassmorphism theme, working authentication, and 8 fully built pages using mock data (backend can be added later).

---

## Page 1: Authentication (Login + Register)
- Split layout with two glassmorphic cards side-by-side
- **Left card**: Login form with avatar placeholder, username/password inputs, green neon login button
- **Right card**: Register form with avatar placeholder, 4 registration fields, green neon register button
- Working auth via Supabase (email/password signup & login)
- Dark background with subtle gradient, glowing borders, focus effects on inputs
- Successful login redirects to Dashboard; all other pages are protected routes

## Page 2: Main Dashboard
- Fixed left sidebar navigation with links to all pages (Dashboard, Vehicle Registry, Trip Dispatcher, Maintenance, Trip & Expense, Performance, Analytics)
- Sidebar uses collapsible design with icons
- **Top toolbar**: Search bar, Group By/Filter/Sort buttons, "New Trip" and "New Vehicle" action buttons
- **KPI row**: 3 glowing metric cards — Active Fleet, Maintenance Alerts, Pending Cargo
- **Data table**: Trips table with Trip, Vehicle, Driver, Status columns; status shown as glowing colored pills; hover highlight on rows

## Page 3: Vehicle Registry
- **Left panel**: Floating modal-style form for "New Vehicle Registration" with fields (License Plate, Max Payload, Initial Odometer, Type, Model) and Save/Cancel buttons
- **Right panel**: Vehicle fleet table with columns (No, Plate, Model, Type, Capacity, Odometer, Status, Actions)
- Toolbar with search, filters, and "+ New Vehicle" button
- Status shown as colored pills, row hover glow effects

## Page 4: Trip Dispatcher
- **Top section**: Trips table with columns (Trip, Fleet Type, Origin, Destination, Status)
- **Bottom section**: "New Trip Form" card with fields (Select Vehicle, Cargo Weight, Select Driver, Origin, Destination, Estimated Fuel Cost)
- Full-width green "Confirm & Dispatch Trip" submit button
- Dark glass card container with rounded edges

## Page 5: Maintenance Logs
- **Left panel**: Floating "New Service" form with fields (Vehicle Name, Issue/Service, Date picker) and Create/Cancel buttons
- **Right panel**: Maintenance log table with columns (Log ID, Vehicle, Issue, Date, Cost, Status)
- Toolbar with search and filters, status pills colored by type

## Page 6: Expense & Fuel Logging
- **Left panel**: Small floating "New Expense" form with fields (Trip ID, Driver, Fuel Cost, Misc Expense) and Create/Cancel buttons
- **Right panel**: Expense table with columns (Trip ID, Driver, Distance, Fuel Expense, Misc Expense, Status)
- Status shown as colored badges

## Page 7: Driver Performance
- Full-width data table with toolbar (Search, Group By, Filter, Sort)
- Columns: Name, License #, Expiry, Completion Rate, Safety Score, Complaints
- Safety score with colored indicators, expiry date warnings for near-expiry dates
- Minimal grid lines, soft neon borders

## Page 8: Analytics Dashboard
- **Top row**: 3 metric cards (Total Fuel Cost, Fleet ROI, Utilization Rate) with neon borders
- **Middle row**: Two charts side-by-side — Fuel Efficiency Trend (line chart) and Top 5 Costliest Vehicles (bar chart) using Recharts
- **Bottom section**: Financial summary table (Month, Revenue, Fuel Cost, Maintenance, Net Profit)

---

## Global Design System
- **Theme**: Dark background with glassmorphism effects (backdrop blur, translucent cards)
- **Borders**: Thin neon-style glowing borders (green accent)
- **Text**: Soft white for primary text, dimmed for labels
- **Buttons**: Neon green outline with hover glow animations
- **Cards**: Rounded corners with subtle glow borders
- **Tables**: Dark containers, hover highlights, colored status pills
- **Layout**: Shared sidebar navigation across all dashboard pages (Pages 2–8)

## Backend (Supabase)
- Set up Supabase connection for authentication only
- Email/password auth with protected routes
- All fleet data (vehicles, trips, maintenance, expenses, drivers) uses mock/sample data for now — ready to connect to a real database later

