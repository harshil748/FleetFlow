import { useState, useEffect } from "react";
import { Truck, AlertTriangle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Toolbar from "@/components/Toolbar";
import StatusPill from "@/components/StatusPill";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ activeFleet: 0, maintenanceAlerts: 0, pendingCargo: 0 });
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // 1. Get recent trips
      const { data: recentTrips } = await supabase
        .from('trips')
        .select('*, vehicles(license_plate), drivers(full_name)')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentTrips) setTrips(recentTrips);

      // 2. Count Active Fleet (Vehicles on trip)
      const { count: activeFleetCount } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'on_trip');

      // 3. Count in-shop vehicles
      const { count: inShopCount } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'in_shop');

      // 4. Count Draft/Pending Trips
      const { count: pendingCount } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');

      setStats({
        activeFleet: activeFleetCount || 0,
        maintenanceAlerts: inShopCount || 0,
        pendingCargo: pendingCount || 0,
      });
    };

    fetchDashboardData();

    // Realtime: re-fetch stats whenever vehicles or trips change
    const channel = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, () => fetchDashboardData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const kpis = [
    { label: "Active Fleet", value: stats.activeFleet, icon: Truck },
    { label: "Maintenance Alerts", value: stats.maintenanceAlerts, icon: AlertTriangle },
    { label: "Pending Trips", value: stats.pendingCargo, icon: Package },
  ];

  return (
    <div className="space-y-6">
      <Toolbar
        searchPlaceholder="Search trips..."
        actions={
          <>
            <Button className="neon-button" onClick={() => navigate('/trips')}>+ New Trip</Button>
            <Button className="neon-button" onClick={() => navigate('/vehicles')}>+ New Vehicle</Button>
          </>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="glass rounded-xl p-6 neon-border flex flex-col items-center gap-3 bg-card/40 backdrop-blur-md">
            <kpi.icon className="h-8 w-8 text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span className="text-sm text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
            <span className="text-4xl font-bold neon-text">{kpi.value}</span>
          </div>
        ))}
      </div>

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No recent trips.</TableCell>
              </TableRow>
            ) : (
              trips.map((trip) => (
                <TableRow key={trip.id} className="border-border/20 table-row-hover transition-colors">
                  <TableCell className="font-medium text-xs">{trip.id.substring(0, 8)}</TableCell>
                  <TableCell>{trip.vehicles?.license_plate}</TableCell>
                  <TableCell>{trip.drivers?.full_name}</TableCell>
                  <TableCell>{trip.cargo_weight}</TableCell>
                  <TableCell><StatusPill status={trip.status} /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
