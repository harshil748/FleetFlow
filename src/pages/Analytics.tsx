import { DollarSign, TrendingUp, Gauge } from "lucide-react";
import { mockAnalytics } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const kpis = [
  { label: "Total Fuel Cost", value: `$${mockAnalytics.totalFuelCost.toLocaleString()}`, icon: DollarSign },
  { label: "Fleet ROI", value: `${mockAnalytics.fleetROI}%`, icon: TrendingUp },
  { label: "Utilization Rate", value: `${mockAnalytics.utilizationRate}%`, icon: Gauge },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="glass rounded-xl p-6 neon-border flex flex-col items-center gap-3">
            <kpi.icon className="h-8 w-8 text-primary" />
            <span className="text-sm text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
            <span className="text-3xl font-bold neon-text">{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6 neon-border">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Fuel Efficiency Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockAnalytics.fuelEfficiency}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 14%)" />
              <XAxis dataKey="month" stroke="hsl(220 10% 55%)" fontSize={12} />
              <YAxis stroke="hsl(220 10% 55%)" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(220 20% 7%)", border: "1px solid hsl(142 40% 20%)", borderRadius: "8px" }} />
              <Line type="monotone" dataKey="mpg" stroke="hsl(142 72% 50%)" strokeWidth={2} dot={{ fill: "hsl(142 72% 50%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-xl p-6 neon-border">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Top 5 Costliest Vehicles</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockAnalytics.costliestVehicles}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 14%)" />
              <XAxis dataKey="vehicle" stroke="hsl(220 10% 55%)" fontSize={12} />
              <YAxis stroke="hsl(220 10% 55%)" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(220 20% 7%)", border: "1px solid hsl(142 40% 20%)", borderRadius: "8px" }} />
              <Bar dataKey="cost" fill="hsl(142 72% 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="glass rounded-xl neon-border overflow-hidden">
        <div className="p-4 border-b border-border/30">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Financial Summary</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Month</TableHead>
              <TableHead className="text-muted-foreground text-right">Revenue</TableHead>
              <TableHead className="text-muted-foreground text-right">Fuel Cost</TableHead>
              <TableHead className="text-muted-foreground text-right">Maintenance</TableHead>
              <TableHead className="text-muted-foreground text-right">Net Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAnalytics.financials.map((f) => (
              <TableRow key={f.month} className="border-border/20 table-row-hover">
                <TableCell className="font-medium">{f.month}</TableCell>
                <TableCell className="text-right text-green-400">${f.revenue.toLocaleString()}</TableCell>
                <TableCell className="text-right text-red-400">${f.fuelCost.toLocaleString()}</TableCell>
                <TableCell className="text-right text-yellow-400">${f.maintenance.toLocaleString()}</TableCell>
                <TableCell className="text-right font-bold neon-text">${f.netProfit.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
