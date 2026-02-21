import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Toolbar from "@/components/Toolbar";
import StatusPill from "@/components/StatusPill";
import { mockVehicles } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Vehicles() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex gap-6">
      {/* Registration Form */}
      {showForm && (
        <div className="w-80 shrink-0 glass-strong rounded-2xl p-6 neon-border space-y-4 self-start">
          <h3 className="text-lg font-bold neon-text">New Vehicle Registration</h3>
          <Input placeholder="License Plate" className="glass border-border/40 focus:neon-border" />
          <Input placeholder="Max Payload" className="glass border-border/40 focus:neon-border" />
          <Input placeholder="Initial Odometer" className="glass border-border/40 focus:neon-border" />
          <Input placeholder="Type" className="glass border-border/40 focus:neon-border" />
          <Input placeholder="Model" className="glass border-border/40 focus:neon-border" />
          <div className="flex gap-3">
            <Button className="flex-1 neon-button">Save</Button>
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
        <div className="glass rounded-xl neon-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-transparent">
                <TableHead className="text-muted-foreground">No</TableHead>
                <TableHead className="text-muted-foreground">Plate</TableHead>
                <TableHead className="text-muted-foreground">Model</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Capacity</TableHead>
                <TableHead className="text-muted-foreground">Odometer</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVehicles.map((v) => (
                <TableRow key={v.id} className="border-border/20 table-row-hover">
                  <TableCell>{v.id}</TableCell>
                  <TableCell className="font-medium">{v.plate}</TableCell>
                  <TableCell>{v.model}</TableCell>
                  <TableCell>{v.type}</TableCell>
                  <TableCell>{v.capacity}</TableCell>
                  <TableCell>{v.odometer.toLocaleString()} km</TableCell>
                  <TableCell><StatusPill status={v.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
