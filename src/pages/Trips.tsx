import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusPill from "@/components/StatusPill";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function Trips() {
  const [trips, setTrips] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [cargoWeight, setCargoWeight] = useState("");

  // Note: we're only going to save the data strictly defined in our schema
  // We can't save origin/destination as they don't exist in our DB schema

  const fetchData = async () => {
    setLoading(true);

    // Fetch Trips with joined Vehicle and Driver data
    const { data: tripsData, error: tripsError } = await supabase
      .from('trips')
      .select('*, vehicles(license_plate, type), drivers(full_name)')
      .order('created_at', { ascending: false });

    if (tripsError) {
      toast.error("Failed to load trips");
    } else {
      setTrips(tripsData || []);
    }

// Fetch Available Vehicles — show all active (not retired/in_shop) so selector is never empty
  const { data: vehicleData } = await supabase
    .from('vehicles')
    .select('*')
    .in('status', ['available', 'on_trip'])
    .order('license_plate');
  if (vehicleData) setVehicles(vehicleData);

  // Fetch On Duty + On Trip Drivers (on_trip means currently assigned but re-dispatch allowed for demo)
  const { data: driverData } = await supabase
    .from('drivers')
    .select('*')
    .in('status', ['on_duty', 'on_trip'])
    .order('full_name');
    if (driverData) setDrivers(driverData);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDispatch = async () => {
    if (!selectedVehicle || !selectedDriver || !cargoWeight) {
      toast.error('Please select a vehicle, driver, and enter cargo weight');
      return;
    }

    const { error } = await supabase.from('trips').insert([
      {
        vehicle_id: selectedVehicle,
        driver_id: selectedDriver,
        cargo_weight: Number(cargoWeight),
        status: 'dispatched',
        dispatcher_id: null
      }
    ]);

    if (error) {
      toast.error('Dispatch Error: ' + error.message);
    } else {
      toast.success('Trip dispatched successfully!');
      setSelectedVehicle("");
      setSelectedDriver("");
      setCargoWeight("");
      fetchData(); // Refresh UI
    }
  };

  const markComplete = async (tripId: string) => {
    const endOdometer = window.prompt("Enter final odometer reading for this vehicle:");
    if (!endOdometer) return;

    const { error } = await supabase
      .from('trips')
      .update({ status: 'completed', end_odometer: Number(endOdometer) })
      .eq('id', tripId);

    if (error) {
      toast.error("Failed to complete trip: " + error.message);
    } else {
      toast.success("Trip marked locally completed - status reverted to available.");
      fetchData();
    }
  }

  return (
    <div className="space-y-6">
      {/* Trips Table */}
      <div className="glass rounded-xl neon-border overflow-hidden bg-card/30">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Trip ID</TableHead>
              <TableHead className="text-muted-foreground">Vehicle Plate</TableHead>
              <TableHead className="text-muted-foreground">Driver</TableHead>
              <TableHead className="text-muted-foreground">Cargo (kg)</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading active trips...</TableCell>
              </TableRow>
            ) : trips.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No trips found in database.</TableCell>
              </TableRow>
            ) : (
              trips.map((trip) => (
                <TableRow key={trip.id} className="border-border/20 table-row-hover transition-colors">
                  <TableCell className="font-medium text-xs">{trip.id.substring(0, 8)}</TableCell>
                  <TableCell>{trip.vehicles?.license_plate}</TableCell>
                  <TableCell>{trip.drivers?.full_name}</TableCell>
                  <TableCell>{trip.cargo_weight}</TableCell>
                  <TableCell><StatusPill status={trip.status} /></TableCell>
                  <TableCell>
                    {trip.status === 'dispatched' && (
                      <Button size="sm" variant="outline" className="border-primary/50 text-primary hover:bg-primary/20 h-7" onClick={() => markComplete(trip.id)}>Complete</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* New Trip Form */}
      <div className="glass-strong rounded-2xl p-8 neon-border space-y-5 bg-card/50 backdrop-blur-md">
        <h3 className="text-lg font-bold neon-text">Dispatch New Trip</h3>
        <p className="text-sm text-muted-foreground mb-4">Note: The system rule automatically verifies driver license capabilities and cargo capacities.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
            <SelectTrigger className="glass border-border/40"><SelectValue placeholder="Select Vehicle" /></SelectTrigger>
            <SelectContent position="popper" className="z-50 bg-popover border border-border text-popover-foreground shadow-lg">
              {vehicles.length === 0
                ? <SelectItem value="__none" disabled>No vehicles found — run seed data</SelectItem>
                : vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.license_plate} · {v.type} · max {v.max_load_capacity} kg
                      {v.status !== 'available' && <span className="ml-2 text-amber-400 text-xs">({v.status})</span>}
                    </SelectItem>
                  ))
              }
            </SelectContent>
          </Select>

          <Select value={selectedDriver} onValueChange={setSelectedDriver}>
            <SelectTrigger className="glass border-border/40"><SelectValue placeholder="Select Driver" /></SelectTrigger>
            <SelectContent position="popper" className="z-50 bg-popover border border-border text-popover-foreground shadow-lg">
              {drivers.length === 0
                ? <SelectItem value="__none" disabled>No drivers found — run seed data</SelectItem>
                : drivers.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.full_name} · score {d.safety_score}
                    </SelectItem>
                  ))
              }
            </SelectContent>
          </Select>

          <Input
            placeholder="Cargo Weight (kg)"
            type="number"
            value={cargoWeight}
            onChange={(e) => setCargoWeight(e.target.value)}
            className="glass border-border/40 focus:neon-border md:col-span-2"
          />
        </div>
        <Button className="w-full neon-button font-semibold text-base py-5 mt-2" onClick={handleDispatch}>Confirm & Dispatch</Button>
      </div>
    </div>
  );
}
