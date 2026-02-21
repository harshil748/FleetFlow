# FleetFlow

A modular fleet and logistics management system built with React, Tailwind, and Supabase.

## Features

- **Authentication** — Secure email/password login and registration via Supabase Auth
- **Dashboard** — Real-time KPIs: active fleet, maintenance alerts, pending cargo
- **Vehicle Registry** — Add, view, and manage the fleet with status tracking
- **Trip Dispatcher** — Create and dispatch trips with vehicle, driver, and cargo details
- **Maintenance Logs** — Track service records with issue type, date, and cost
- **Trip & Expense** — Monitor trip costs and fuel expenses
- **Performance** — Driver and vehicle performance metrics
- **Analytics** — Visual charts and trend data across the fleet

## Tech Stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tooling
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) — accessible component library built on Radix UI
- [Supabase](https://supabase.com/) — backend-as-a-service (auth + database)
- [React Router v6](https://reactrouter.com/) — client-side routing
- [TanStack Query](https://tanstack.com/query) — async data management
- [Recharts](https://recharts.org/) — charting library

## Getting Started

### Prerequisites

- Node.js >= 18
- A Supabase project (create one free at https://supabase.com)

### Setup

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd FleetFlow1

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env

# 4. Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file at the project root:

```
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-public-key>
```

### Build

```bash
npm run build      # production build -> dist/
npm run preview    # preview the production build locally
```

## Project Structure

```
src/
 components/            # Shared layout and UI components
    ui/                # shadcn/ui primitive components
 hooks/                 # Custom React hooks
 lib/
    supabaseClient.ts  # Supabase client initialisation
    utils.ts           # Utility helpers
 pages/                 # Route-level page components
 data/                  # Static/mock data
```

## License

MIT
