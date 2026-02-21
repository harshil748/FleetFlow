import Toolbar from "@/components/Toolbar";
import { mockDrivers } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Performance() {
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
    <div className="space-y-4">
      <Toolbar searchPlaceholder="Search drivers..." />
      <div className="glass rounded-xl neon-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">License #</TableHead>
              <TableHead className="text-muted-foreground">Expiry</TableHead>
              <TableHead className="text-muted-foreground text-center">Completion Rate</TableHead>
              <TableHead className="text-muted-foreground text-center">Safety Score</TableHead>
              <TableHead className="text-muted-foreground text-center">Complaints</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDrivers.map((d) => (
              <TableRow key={d.id} className="border-border/20 table-row-hover">
                <TableCell className="font-medium">{d.name}</TableCell>
                <TableCell className="font-mono text-sm">{d.license}</TableCell>
                <TableCell className={isNearExpiry(d.expiry) ? "text-red-400" : ""}>{d.expiry}</TableCell>
                <TableCell className="text-center">{d.completionRate}%</TableCell>
                <TableCell className={`text-center font-bold ${scoreColor(d.safetyScore)}`}>{d.safetyScore}</TableCell>
                <TableCell className="text-center">{d.complaints}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
