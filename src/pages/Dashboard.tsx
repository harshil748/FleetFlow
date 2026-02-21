import { Truck, AlertTriangle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Toolbar from "@/components/Toolbar";
import StatusPill from "@/components/StatusPill";
import { mockTrips } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const kpis = [
  { label: "Active Fleet", value: 5, icon: Truck },
  { label: "Maintenance Alerts", value: 2, icon: AlertTriangle },
  { label: "Pending Cargo", value: 3, icon: Package },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <Toolbar
        searchPlaceholder="Search trips..."
        actions={
          <>
            <Button className="neon-button">+ New Trip</Button>
            <Button className="neon-button">+ New Vehicle</Button>
          </>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="glass rounded-xl p-6 neon-border flex flex-col items-center gap-3">
            <kpi.icon className="h-8 w-8 text-primary" />
            <span className="text-sm text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
            <span className="text-4xl font-bold neon-text">{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* Trips Table */}
      <div className="glass rounded-xl neon-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Trip</TableHead>
              <TableHead className="text-muted-foreground">Vehicle</TableHead>
              <TableHead className="text-muted-foreground">Driver</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTrips.map((trip) => (
              <TableRow key={trip.id} className="border-border/20 table-row-hover">
                <TableCell className="font-medium">{trip.id}</TableCell>
                <TableCell>{trip.vehicle}</TableCell>
                <TableCell>{trip.driver}</TableCell>
                <TableCell><StatusPill status={trip.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
