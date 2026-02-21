import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusPill from "@/components/StatusPill";
import { mockTrips, mockVehicles, mockDrivers } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Trips() {
  return (
    <div className="space-y-6">
      {/* Trips Table */}
      <div className="glass rounded-xl neon-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Trip</TableHead>
              <TableHead className="text-muted-foreground">Fleet Type</TableHead>
              <TableHead className="text-muted-foreground">Origin</TableHead>
              <TableHead className="text-muted-foreground">Destination</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTrips.map((trip) => (
              <TableRow key={trip.id} className="border-border/20 table-row-hover">
                <TableCell className="font-medium">{trip.id}</TableCell>
                <TableCell>{trip.fleetType}</TableCell>
                <TableCell>{trip.origin}</TableCell>
                <TableCell>{trip.destination}</TableCell>
                <TableCell><StatusPill status={trip.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* New Trip Form */}
      <div className="glass-strong rounded-2xl p-8 neon-border space-y-5">
        <h3 className="text-lg font-bold neon-text">New Trip Form</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select>
            <SelectTrigger className="glass border-border/40"><SelectValue placeholder="Select Vehicle" /></SelectTrigger>
            <SelectContent>{mockVehicles.map((v) => <SelectItem key={v.id} value={v.plate}>{v.plate} — {v.model}</SelectItem>)}</SelectContent>
          </Select>
          <Input placeholder="Cargo Weight" className="glass border-border/40 focus:neon-border" />
          <Select>
            <SelectTrigger className="glass border-border/40"><SelectValue placeholder="Select Driver" /></SelectTrigger>
            <SelectContent>{mockDrivers.map((d) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
          </Select>
          <Input placeholder="Origin Address" className="glass border-border/40 focus:neon-border" />
          <Input placeholder="Destination" className="glass border-border/40 focus:neon-border" />
          <Input placeholder="Estimated Fuel Cost" className="glass border-border/40 focus:neon-border" />
        </div>
        <Button className="w-full neon-button font-semibold text-base py-5">Confirm & Dispatch Trip</Button>
      </div>
    </div>
  );
}
