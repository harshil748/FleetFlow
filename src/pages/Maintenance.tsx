import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Toolbar from "@/components/Toolbar";
import StatusPill from "@/components/StatusPill";
import { mockMaintenance } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Maintenance() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex gap-6">
      {showForm && (
        <div className="w-80 shrink-0 glass-strong rounded-2xl p-6 neon-border space-y-4 self-start">
          <h3 className="text-lg font-bold neon-text">New Service</h3>
          <Input placeholder="Vehicle Name" className="glass border-border/40 focus:neon-border" />
          <Input placeholder="Issue / Service" className="glass border-border/40 focus:neon-border" />
          <Input type="date" placeholder="Date" className="glass border-border/40 focus:neon-border" />
          <div className="flex gap-3">
            <Button className="flex-1 neon-button">Create</Button>
            <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10">Cancel</Button>
          </div>
        </div>
      )}

      <div className="flex-1 space-y-4">
        <Toolbar
          searchPlaceholder="Search maintenance logs..."
          actions={<Button className="neon-button" onClick={() => setShowForm(true)}>+ New Service</Button>}
        />
        <div className="glass rounded-xl neon-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Log ID</TableHead>
                <TableHead className="text-muted-foreground">Vehicle</TableHead>
                <TableHead className="text-muted-foreground">Issue</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Cost</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMaintenance.map((m) => (
                <TableRow key={m.id} className="border-border/20 table-row-hover">
                  <TableCell className="font-medium">{m.id}</TableCell>
                  <TableCell>{m.vehicle}</TableCell>
                  <TableCell>{m.issue}</TableCell>
                  <TableCell>{m.date}</TableCell>
                  <TableCell>${m.cost.toLocaleString()}</TableCell>
                  <TableCell><StatusPill status={m.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
