import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Toolbar from "@/components/Toolbar";
import StatusPill from "@/components/StatusPill";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function Vehicles() {
  const [showForm, setShowForm] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [plate, setPlate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [odometer, setOdometer] = useState("");
  const [type, setType] = useState("truck");
  const [model, setModel] = useState("");

  const fetchVehicles = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
    if (error) {
      toast.error('Failed to load vehicles');
      console.error(error);
    } else {
      setVehicles(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSave = async () => {
    if (!plate || !capacity || !odometer || !model) {
      toast.error('Please fill all fields');
      return;
    }

    const { error } = await supabase.from('vehicles').insert([
      {
        license_plate: plate,
        max_load_capacity: Number(capacity),
        odometer: Number(odometer),
        type: type,
        name_model: model,
        status: 'available'
      }
    ]);

    if (error) {
      toast.error('Error adding vehicle: ' + error.message);
    } else {
      toast.success('Vehicle added successfully!');
      setShowForm(false);
      setPlate("");
      setCapacity("");
      setOdometer("");
      setModel("");
      fetchVehicles();
    }
  };

  return (
    <div className="flex gap-6">
      {/* Registration Form */}
      {showForm && (
        <div className="w-80 shrink-0 glass-strong rounded-2xl p-6 neon-border space-y-4 self-start bg-card/50 backdrop-blur-md">
          <h3 className="text-lg font-bold neon-text">New Vehicle Registration</h3>
          <Input
            placeholder="License Plate (e.g., FLT-001)"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            className="glass border-border/40 focus:neon-border"
          />
          <Input
            placeholder="Max Payload (kg / tons)"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="glass border-border/40 focus:neon-border"
          />
          <Input
            placeholder="Initial Odometer (km)"
            type="number"
            value={odometer}
            onChange={(e) => setOdometer(e.target.value)}
            className="glass border-border/40 focus:neon-border"
          />
          <select
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm glass border-border/40 focus:neon-border"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="truck">Truck</option>
            <option value="van">Van</option>
            <option value="bike">Bike</option>
          </select>
          <Input
            placeholder="Name/Model (e.g., Volvo FH16)"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="glass border-border/40 focus:neon-border"
          />
          <div className="flex gap-3 mt-4">
            <Button className="flex-1 neon-button" onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10">Cancel</Button>
          </div>
        </div>
      )}

      {/* Vehicle Table */}
      <div className="flex-1 space-y-4">
        <Toolbar
          searchPlaceholder="Search vehicles..."
          actions={<Button className="neon-button" onClick={() => setShowForm(true)}>+ New Vehicle</Button>}
        />
        <div className="glass rounded-xl neon-border overflow-hidden bg-card/30">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-transparent">
                <TableHead className="text-muted-foreground w-12">No</TableHead>
                <TableHead className="text-muted-foreground">Plate</TableHead>
                <TableHead className="text-muted-foreground">Model</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Capacity</TableHead>
                <TableHead className="text-muted-foreground">Odometer</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading vehicles...</TableCell>
                </TableRow>
              ) : vehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No vehicles found. Add one to get started.</TableCell>
                </TableRow>
              ) : (
                vehicles.map((v, index) => (
                  <TableRow key={v.id} className="border-border/20 table-row-hover transition-colors">
                    <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                    <TableCell className="font-medium">{v.license_plate}</TableCell>
                    <TableCell>{v.name_model}</TableCell>
                    <TableCell className="capitalize">{v.type}</TableCell>
                    <TableCell>{v.max_load_capacity.toLocaleString()}</TableCell>
                    <TableCell>{v.odometer.toLocaleString()} km</TableCell>
                    <TableCell><StatusPill status={v.status} /></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
