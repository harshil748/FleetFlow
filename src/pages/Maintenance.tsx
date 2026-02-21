import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Toolbar from "@/components/Toolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function Maintenance() {
  const [showForm, setShowForm] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [issue, setIssue] = useState("");
  const [cost, setCost] = useState("");

  const fetchData = async () => {
    setLoading(true);
    // Fetch logs with joined vehicle plate
    const { data: logData } = await supabase
      .from('maintenance_logs')
      .select('*, vehicles(license_plate)')
      .order('created_at', { ascending: false });

    if (logData) setLogs(logData);

    // Fetch vehicles for the dropdown
    const { data: vData } = await supabase.from('vehicles').select('*');
    if (vData) setVehicles(vData);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!selectedVehicle || !issue || !cost) {
      toast.error('Please fill out all fields');
      return;
    }

    const { error } = await supabase.from('maintenance_logs').insert([
      {
        vehicle_id: selectedVehicle,
        description: issue,
        cost: Number(cost)
      }
    ]);

    if (error) {
      toast.error('Error logging maintenance: ' + error.message);
    } else {
      toast.success('Maintenance logged! Vehicle status automatically changed to "in_shop".');
      setShowForm(false);
      setSelectedVehicle("");
      setIssue("");
      setCost("");
      fetchData();
    }
  };

  return (
    <div className="flex gap-6">
      {/* Maintenance Form */}
      {showForm && (
        <div className="w-80 shrink-0 glass-strong rounded-2xl p-6 neon-border space-y-4 self-start bg-card/50 backdrop-blur-md">
          <h3 className="text-lg font-bold neon-text">Schedule Maintenance</h3>

          <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
            <SelectTrigger className="glass border-border/40 focus:neon-border"><SelectValue placeholder="Select Vehicle" /></SelectTrigger>
            <SelectContent>
              {vehicles.map((v) => <SelectItem key={v.id} value={v.id}>{v.license_plate} - {v.name_model}</SelectItem>)}
            </SelectContent>
          </Select>

          <Input
            placeholder="Issue Description (e.g., Oil Change)"
            value={issue} onChange={(e) => setIssue(e.target.value)}
            className="glass border-border/40 focus:neon-border"
          />
          <Input
            type="number"
            placeholder="Cost Est (₹)"
            value={cost} onChange={(e) => setCost(e.target.value)}
            className="glass border-border/40 focus:neon-border"
          />

          <div className="flex gap-3 mt-4">
            <Button className="flex-1 neon-button hover:bg-yellow-500 hover:border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]" onClick={handleSave}>Log Issue</Button>
            <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10">Cancel</Button>
          </div>
        </div>
      )}

      {/* Maintenance Table */}
      <div className="flex-1 space-y-4">
        <Toolbar
          searchPlaceholder="Search maintenance logs..."
          actions={<Button className="neon-button border-yellow-500 text-yellow-500 hover:bg-yellow-500/20 box-shadow-[0_0_15px_rgba(234,179,8,0.3)] shadow-[0_0_15px_rgba(234,179,8,0.1)]" onClick={() => setShowForm(true)}>+ Log Maintenance</Button>}
        />
        <div className="glass rounded-xl neon-border overflow-hidden bg-card/30">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-transparent">
                <TableHead className="text-muted-foreground w-12">No</TableHead>
                <TableHead className="text-muted-foreground">Vehicle</TableHead>
                <TableHead className="text-muted-foreground">Issue</TableHead>
                <TableHead className="text-muted-foreground">Cost</TableHead>
                <TableHead className="text-muted-foreground">Date Logged</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading maintenance logs...</TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No maintenance logs found.</TableCell>
                </TableRow>
              ) : (
                logs.map((log, index) => (
                  <TableRow key={log.id} className="border-border/20 table-row-hover transition-colors">
                    <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                    <TableCell className="font-medium text-yellow-400">{log.vehicles?.license_plate}</TableCell>
                    <TableCell>{log.description}</TableCell>
                    <TableCell className="text-red-400 font-semibold">₹{Number(log.cost).toLocaleString('en-IN')}</TableCell>
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
