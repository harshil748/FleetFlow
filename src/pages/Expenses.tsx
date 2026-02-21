import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Toolbar from "@/components/Toolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function Expenses() {
  const [showForm, setShowForm] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [liters, setLiters] = useState("");
  const [cost, setCost] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const { data: logData, error } = await supabase
      .from('fuel_logs')
      .select('*, vehicles(license_plate)')
      .order('created_at', { ascending: false });

    if (!error && logData) setLogs(logData);

    const { data: vData } = await supabase.from('vehicles').select('*');
    if (vData) setVehicles(vData);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!selectedVehicle || !liters || !cost) {
      toast.error('Please fill all fields');
      return;
    }

    const { error } = await supabase.from('fuel_logs').insert([
      {
        vehicle_id: selectedVehicle,
        liters: Number(liters),
        cost: Number(cost)
      }
    ]);

    if (error) {
      toast.error('Error logging fuel: ' + error.message);
    } else {
      toast.success('Fuel logged successfully');
      setShowForm(false);
      setSelectedVehicle("");
      setLiters("");
      setCost("");
      fetchData();
    }
  };

  return (
    <div className="flex gap-6">
      {showForm && (
        <div className="w-72 shrink-0 glass-strong rounded-2xl p-6 neon-border space-y-4 self-start bg-card/50 backdrop-blur-md">
          <h3 className="text-lg font-bold neon-text">Log Fuel Expense</h3>

          <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
            <SelectTrigger className="glass border-border/40 focus:neon-border"><SelectValue placeholder="Select Vehicle" /></SelectTrigger>
            <SelectContent>
              {vehicles.map((v) => <SelectItem key={v.id} value={v.id}>{v.license_plate}</SelectItem>)}
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Liters of Fuel"
            value={liters} onChange={(e) => setLiters(e.target.value)}
            className="glass border-border/40 focus:neon-border"
          />
          <Input
            type="number"
            placeholder="Total Cost ($)"
            value={cost} onChange={(e) => setCost(e.target.value)}
            className="glass border-border/40 focus:neon-border"
          />
          <div className="flex gap-3 mt-4">
            <Button className="flex-1 neon-button" onClick={handleSave}>Log Fuel</Button>
            <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10">Cancel</Button>
          </div>
        </div>
      )}

      <div className="flex-1 space-y-4">
        <Toolbar
          searchPlaceholder="Search logs..."
          actions={<Button className="neon-button" onClick={() => setShowForm(true)}>+ Log Fuel</Button>}
        />
        <div className="glass rounded-xl neon-border overflow-hidden bg-card/30">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-transparent">
                <TableHead className="text-muted-foreground w-12">No</TableHead>
                <TableHead className="text-muted-foreground">Vehicle</TableHead>
                <TableHead className="text-muted-foreground">Liters Logged</TableHead>
                <TableHead className="text-muted-foreground">Cost</TableHead>
                <TableHead className="text-muted-foreground">Date Logged</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading fuel expenses...</TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No fuel logs found.</TableCell>
                </TableRow>
              ) : (
                logs.map((log, index) => (
                  <TableRow key={log.id} className="border-border/20 table-row-hover transition-colors">
                    <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                    <TableCell className="font-medium">{log.vehicles?.license_plate}</TableCell>
                    <TableCell>{Number(log.liters).toLocaleString()} L</TableCell>
                    <TableCell className="text-emerald-400 font-semibold">₹{Number(log.cost).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>{new Date(log.created_at).toLocaleDateString()}</TableCell>
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
