import { useState, useEffect } from "react";
import Toolbar from "@/components/Toolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function Performance() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [license, setLicense] = useState("");
  const [expiry, setExpiry] = useState("");
  const [type, setType] = useState("truck");

  const fetchDrivers = async () => {
    setLoading(true);
    const { data } = await supabase.from('drivers').select('*').order('created_at', { ascending: false });
    if (data) setDrivers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleSave = async () => {
    if (!name || !license || !expiry) {
      toast.error('Please fill all driver details');
      return;
    }

    const { error } = await supabase.from('drivers').insert([
      {
        full_name: name,
        license_number: license,
        license_expiry: expiry,
        allowed_vehicle_types: [type],
        status: 'on_duty'
      }
    ]);

    if (error) {
      toast.error('Error adding driver: ' + error.message);
    } else {
      toast.success('Driver added successfully!');
      setShowForm(false);
      setName("");
      setLicense("");
      setExpiry("");
      fetchDrivers();
    }
  };

  const isNearExpiry = (date: string) => {
    const diff = new Date(date).getTime() - Date.now();
    return diff < 90 * 24 * 60 * 60 * 1000; // within 90 days
  };

  const scoreColor = (score: number) => {
    if (score >= 95) return "text-green-400";
    if (score >= 85) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="flex gap-6">
      {/* Add Driver Form */}
      {showForm && (
        <div className="w-80 shrink-0 glass-strong rounded-2xl p-6 neon-border space-y-4 self-start bg-card/50 backdrop-blur-md">
          <h3 className="text-lg font-bold neon-text">Add New Driver</h3>
          <Input
            placeholder="Full Name"
            value={name} onChange={(e) => setName(e.target.value)}
            className="glass border-border/40 focus:neon-border"
          />
          <Input
            placeholder="License Number"
            value={license} onChange={(e) => setLicense(e.target.value)}
            className="glass border-border/40 focus:neon-border"
          />
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground ml-1">License Expiry Date</label>
            <Input
              type="date"
              value={expiry} onChange={(e) => setExpiry(e.target.value)}
              className="glass border-border/40 focus:neon-border"
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="glass border-border/40 focus:neon-border"><SelectValue placeholder="Primary Vehicle Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="truck">Truck</SelectItem>
              <SelectItem value="van">Van</SelectItem>
              <SelectItem value="bike">Bike</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-3 mt-4">
            <Button className="flex-1 neon-button" onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10">Cancel</Button>
          </div>
        </div>
      )}

      {/* Driver Table */}
      <div className="flex-1 space-y-4">
        <Toolbar
          searchPlaceholder="Search drivers..."
          actions={<Button className="neon-button" onClick={() => setShowForm(true)}>+ Add Driver</Button>}
        />
        <div className="glass rounded-xl neon-border overflow-hidden bg-card/30">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">License #</TableHead>
                <TableHead className="text-muted-foreground">Allowed Type</TableHead>
                <TableHead className="text-muted-foreground">Expiry Date</TableHead>
                <TableHead className="text-muted-foreground text-center">Safety Score</TableHead>
                <TableHead className="text-muted-foreground text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading drivers...</TableCell>
                </TableRow>
              ) : drivers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No drivers found.</TableCell>
                </TableRow>
              ) : (
                drivers.map((d) => (
                  <TableRow key={d.id} className="border-border/20 table-row-hover transition-colors">
                    <TableCell className="font-medium">{d.full_name}</TableCell>
                    <TableCell className="font-mono text-sm">{d.license_number}</TableCell>
                    <TableCell className="uppercase text-xs">{d.allowed_vehicle_types?.join(', ')}</TableCell>
                    <TableCell className={isNearExpiry(d.license_expiry) ? "text-red-400 font-bold" : ""}>{d.license_expiry}</TableCell>
                    <TableCell className={`text-center font-bold ${scoreColor(Number(d.safety_score))}`}>{Number(d.safety_score)}</TableCell>
                    <TableCell className="text-center capitalize">{d.status.replace('_', ' ')}</TableCell>
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
