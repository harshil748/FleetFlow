-- ==========================================
-- FleetFlow: Modular Fleet & Logistics Schema
-- ==========================================

-- 1. ENUMS (Roles and Statuses)
CREATE TYPE public.user_role AS ENUM ('manager', 'dispatcher', 'safety_officer', 'analyst');
CREATE TYPE public.vehicle_status AS ENUM ('available', 'on_trip', 'in_shop', 'retired');
CREATE TYPE public.vehicle_type AS ENUM ('truck', 'van', 'bike');
CREATE TYPE public.driver_status AS ENUM ('on_duty', 'off_duty', 'suspended', 'on_trip');
CREATE TYPE public.trip_status AS ENUM ('draft', 'dispatched', 'completed', 'cancelled');

-- 2. PROFILES (Extends Supabase Auth Users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role public.user_role NOT NULL DEFAULT 'dispatcher',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. VEHICLES (Asset Management)
CREATE TABLE public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_model TEXT NOT NULL,
    license_plate TEXT UNIQUE NOT NULL,
    max_load_capacity NUMERIC NOT NULL,
    odometer NUMERIC NOT NULL DEFAULT 0,
    status public.vehicle_status NOT NULL DEFAULT 'available',
    type public.vehicle_type NOT NULL,
    acquisition_cost NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. DRIVERS (Human Resources & Compliance)
CREATE TABLE public.drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    license_number TEXT UNIQUE NOT NULL,
    license_expiry DATE NOT NULL,
    allowed_vehicle_types public.vehicle_type[] NOT NULL DEFAULT '{}',
    status public.driver_status NOT NULL DEFAULT 'on_duty',
    safety_score NUMERIC DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TRIPS (Trip Dispatcher & Management)
CREATE TABLE public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE RESTRICT NOT NULL,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE RESTRICT NOT NULL,
    dispatcher_id UUID REFERENCES public.profiles(id) DEFAULT auth.uid(),
    status public.trip_status NOT NULL DEFAULT 'draft',
    cargo_weight NUMERIC NOT NULL,
    revenue NUMERIC DEFAULT 0,
    start_odometer NUMERIC,
    end_odometer NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 6. MAINTENANCE LOGS (Health Tracking)
CREATE TABLE public.maintenance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    cost NUMERIC NOT NULL DEFAULT 0,
    logged_by UUID REFERENCES public.profiles(id) DEFAULT auth.uid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. FUEL LOGS (Expense & Fuel Tracking)
CREATE TABLE public.fuel_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
    liters NUMERIC NOT NULL,
    cost NUMERIC NOT NULL,
    logged_by UUID REFERENCES public.profiles(id) DEFAULT auth.uid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ==========================================
-- LOGIC & TRIGGERS
-- ==========================================

-- Rule 1: Validate Capacity and Driver License upon Trip Creation/Dispatch
CREATE OR REPLACE FUNCTION public.validate_trip_dispatch()
RETURNS TRIGGER AS $$
DECLARE
    v_max_capacity NUMERIC;
    d_license_expiry DATE;
    v_type public.vehicle_type;
    d_allowed public.vehicle_type[];
BEGIN
    -- Validation: Cargo Weight vs Max Capacity (Applies even on Drafts)
    SELECT max_load_capacity, type INTO v_max_capacity, v_type FROM public.vehicles WHERE id = NEW.vehicle_id;
    IF NEW.cargo_weight > v_max_capacity THEN
        RAISE EXCEPTION 'Cargo weight (%) exceeds vehicle max capacity (%)', NEW.cargo_weight, v_max_capacity;
    END IF;

    -- Extra Validations only apply when marking as 'dispatched'
    IF NEW.status = 'dispatched' AND (TG_OP = 'INSERT' OR OLD.status != 'dispatched') THEN
        SELECT license_expiry, allowed_vehicle_types INTO d_license_expiry, d_allowed FROM public.drivers WHERE id = NEW.driver_id;
        
        -- Prevent dispatch if license is expired
        IF d_license_expiry < CURRENT_DATE THEN
            RAISE EXCEPTION 'Driver license is expired (Expiry: %)', d_license_expiry;
        END IF;

        -- Prevent dispatch if driver is not licensed for this vehicle type
        IF NOT v_type = ANY(d_allowed) THEN
            RAISE EXCEPTION 'Driver is not licensed for vehicle type %', v_type;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_trip_dispatch_trigger
BEFORE INSERT OR UPDATE ON public.trips
FOR EACH ROW EXECUTE FUNCTION public.validate_trip_dispatch();


-- Rule 2: Handing State Transitions for Trips
CREATE OR REPLACE FUNCTION public.handle_trip_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Marked as DISPATCHED (Start Trip)
    IF NEW.status = 'dispatched' AND OLD.status != 'dispatched' THEN
        -- Update vehicle and driver status
        UPDATE public.vehicles SET status = 'on_trip' WHERE id = NEW.vehicle_id;
        UPDATE public.drivers SET status = 'on_trip' WHERE id = NEW.driver_id;
        -- Auto-set start_odometer based on vehicle's current odometer
        NEW.start_odometer := (SELECT odometer FROM public.vehicles WHERE id = NEW.vehicle_id);
    
    -- Marked as COMPLETED (End Trip)
    ELSIF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Make available again and update new odometer metric
        UPDATE public.vehicles SET status = 'available', odometer = NEW.end_odometer WHERE id = NEW.vehicle_id;
        UPDATE public.drivers SET status = 'on_duty' WHERE id = NEW.driver_id;
        NEW.completed_at := NOW();
    
    -- Marked as CANCELLED (Revert state)
    ELSIF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        UPDATE public.vehicles SET status = 'available' WHERE id = NEW.vehicle_id;
        UPDATE public.drivers SET status = 'on_duty' WHERE id = NEW.driver_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER handle_trip_status_change_trigger
BEFORE UPDATE ON public.trips
FOR EACH ROW EXECUTE FUNCTION public.handle_trip_status_change();


-- Rule 3: Maintenance Triggers Vehicle Status update
CREATE OR REPLACE FUNCTION public.set_vehicle_in_shop()
RETURNS TRIGGER AS $$
BEGIN
    -- Logging maintenance switches vehicle status to 'in_shop' immediately
    -- removing it from the Dispatcher's selection pool.
    UPDATE public.vehicles SET status = 'in_shop' WHERE id = NEW.vehicle_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_vehicle_in_shop_trigger
AFTER INSERT ON public.maintenance_logs
FOR EACH ROW EXECUTE FUNCTION public.set_vehicle_in_shop();


-- ==========================================
-- RLS (Row Level Security) - Basic Security
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view everything (read-only globally)
CREATE POLICY "Allow read access to authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to authenticated users" ON public.vehicles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to authenticated users" ON public.drivers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to authenticated users" ON public.trips FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to authenticated users" ON public.maintenance_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to authenticated users" ON public.fuel_logs FOR SELECT TO authenticated USING (true);

-- Provide wide ALL access for authenticated users for demo purposes
-- (In a real app, you would restrict INSERT/UPDATE/DELETE based on `auth.uid()` and user roles)
CREATE POLICY "Allow ALL for authenticated" ON public.profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow ALL for authenticated" ON public.vehicles FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow ALL for authenticated" ON public.drivers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow ALL for authenticated" ON public.trips FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow ALL for authenticated" ON public.maintenance_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow ALL for authenticated" ON public.fuel_logs FOR ALL TO authenticated USING (true);
