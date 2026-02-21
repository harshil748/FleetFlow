import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Toolbar from "@/components/Toolbar";
import StatusPill from "@/components/StatusPill";
import { mockExpenses } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Expenses() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex gap-6">
      {showForm && (
        <div className="w-72 shrink-0 glass-strong rounded-2xl p-6 neon-border space-y-4 self-start">
          <h3 className="text-lg font-bold neon-text">New Expense</h3>
          <Input placeholder="Trip ID" className="glass border-border/40 focus:neon-border" />
          <Input placeholder="Driver" className="glass border-border/40 focus:neon-border" />
          <Input placeholder="Fuel Cost" className="glass border-border/40 focus:neon-border" />
          <Input placeholder="Misc Expense" className="glass border-border/40 focus:neon-border" />
          <div className="flex gap-3">
            <Button className="flex-1 neon-button">Create</Button>
            <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10">Cancel</Button>
          </div>
        </div>
      )}

      <div className="flex-1 space-y-4">
        <Toolbar
          searchPlaceholder="Search expenses..."
          actions={<Button className="neon-button" onClick={() => setShowForm(true)}>+ New Expense</Button>}
        />
        <div className="glass rounded-xl neon-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Trip ID</TableHead>
                <TableHead className="text-muted-foreground">Driver</TableHead>
                <TableHead className="text-muted-foreground">Distance</TableHead>
                <TableHead className="text-muted-foreground">Fuel Expense</TableHead>
                <TableHead className="text-muted-foreground">Misc Expense</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockExpenses.map((exp) => (
                <TableRow key={exp.id} className="border-border/20 table-row-hover">
                  <TableCell className="font-medium">{exp.id}</TableCell>
                  <TableCell>{exp.driver}</TableCell>
                  <TableCell>{exp.distance} mi</TableCell>
                  <TableCell>${exp.fuelExpense}</TableCell>
                  <TableCell>${exp.miscExpense}</TableCell>
                  <TableCell><StatusPill status={exp.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
