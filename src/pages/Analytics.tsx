import { useState, useEffect } from "react";
import { IndianRupee, TrendingUp, Gauge, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { supabase } from "@/lib/supabaseClient";

export default function Analytics() {
	const [fuelEfficiencyData, setFuelEfficiencyData] = useState<
		{ month: string; mpg: number }[]
	>([]);
	const [costliestVehiclesData, setCostliestVehiclesData] = useState<
		{ vehicle: string; cost: number }[]
	>([]);
	const [financialsData, setFinancialsData] = useState<
		{
			month: string;
			revenue: number;
			fuelCost: number;
			maintenance: number;
			netProfit: number;
		}[]
	>([]);

	const [stats, setStats] = useState({
		totalFuelCost: 0,
		totalMaintenanceCost: 0,
		activeFleetCount: 0,
		totalFleetCount: 0,
		utilizationRate: 0,
		fleetROI: 0,
	});

	useEffect(() => {
		const fetchStats = async () => {
			// 1. Total Fuel Cost
			const { data: fuelLogs } = await supabase
				.from("fuel_logs")
				.select("cost");
			const totalFuel =
				fuelLogs?.reduce((sum, log) => sum + Number(log.cost), 0) || 0;

			// 2. Total Maintenance Cost
			const { data: maintLogs } = await supabase
				.from("maintenance_logs")
				.select("cost");
			const totalMaintenance =
				maintLogs?.reduce((sum, log) => sum + Number(log.cost), 0) || 0;

			// 3. Vehicles Count
			const { count: activeCount } = await supabase
				.from("vehicles")
				.select("*", { count: "exact", head: true })
				.eq("status", "on_trip");
			const { count: totalCount } = await supabase
				.from("vehicles")
				.select("*", { count: "exact", head: true });

			const utilization =
				totalCount && totalCount > 0 ?
					Math.round(((activeCount || 0) / totalCount) * 100)
				:	0;

			// 4. Trips Revenue (Simulated ROI Calculation)
			// Since acquisition_cost is 0 by default, this is a simplified calculation for demo
			const { data: trips } = await supabase
				.from("trips")
				.select("revenue")
				.eq("status", "completed");
			const totalRevenue =
				trips?.reduce((sum, t) => sum + Number(t.revenue || 0), 0) || 0;

			let roi = 0;
			const expenses = totalFuel + totalMaintenance;
			if (expenses > 0) {
				// Simplified ROI rule metric for presentation
				roi = Math.round(((totalRevenue - expenses) / expenses) * 100);
			}

			setStats({
				totalFuelCost: totalFuel,
				totalMaintenanceCost: totalMaintenance,
				activeFleetCount: activeCount || 0,
				totalFleetCount: totalCount || 0,
				utilizationRate: utilization,
				fleetROI: roi,
			});
		};

		fetchStats();
	}, []);

	useEffect(() => {
		const fetchChartData = async () => {
			// Fuel liters by month
			const { data: fuelLogs } = await supabase
				.from("fuel_logs")
				.select("created_at, liters");
			if (fuelLogs) {
				const byMonth: Record<string, { total: number; count: number }> = {};
				fuelLogs.forEach((log) => {
					const month = new Date(log.created_at).toLocaleString("default", {
						month: "short",
						year: "2-digit",
					});
					if (!byMonth[month]) byMonth[month] = { total: 0, count: 0 };
					byMonth[month].total += Number(log.liters);
					byMonth[month].count += 1;
				});
				setFuelEfficiencyData(
					Object.entries(byMonth).map(([month, d]) => ({
						month,
						mpg: Math.round(d.total / d.count),
					})),
				);
			}

			// Costliest vehicles: sum fuel + maintenance per vehicle
			const { data: allFuel } = await supabase
				.from("fuel_logs")
				.select("vehicle_id, cost");
			const { data: allMaint } = await supabase
				.from("maintenance_logs")
				.select("vehicle_id, cost");
			const { data: vehicles } = await supabase
				.from("vehicles")
				.select("id, license_plate");
			if (allFuel && allMaint && vehicles) {
				const costMap: Record<string, number> = {};
				allFuel.forEach((f) => {
					costMap[f.vehicle_id] = (costMap[f.vehicle_id] || 0) + Number(f.cost);
				});
				allMaint.forEach((m) => {
					costMap[m.vehicle_id] = (costMap[m.vehicle_id] || 0) + Number(m.cost);
				});
				const plateMap: Record<string, string> = {};
				vehicles.forEach((v) => {
					plateMap[v.id] = v.license_plate;
				});
				setCostliestVehiclesData(
					Object.entries(costMap)
						.map(([id, cost]) => ({
							vehicle: plateMap[id] || id.slice(0, 8),
							cost: Math.round(cost),
						}))
						.sort((a, b) => b.cost - a.cost)
						.slice(0, 6),
				);
			}

			// Financial summary by month
			const { data: tripData } = await supabase
				.from("trips")
				.select("created_at, revenue")
				.eq("status", "completed");
			const { data: fuelData } = await supabase
				.from("fuel_logs")
				.select("created_at, cost");
			const { data: maintData } = await supabase
				.from("maintenance_logs")
				.select("created_at, cost");
			const months: Record<
				string,
				{ revenue: number; fuelCost: number; maintenance: number }
			> = {};
			const toMonth = (s: string) =>
				new Date(s).toLocaleString("default", {
					month: "short",
					year: "2-digit",
				});
			tripData?.forEach((t) => {
				if (!t.created_at) return;
				const m = toMonth(t.created_at);
				if (!months[m]) months[m] = { revenue: 0, fuelCost: 0, maintenance: 0 };
				months[m].revenue += Number(t.revenue || 0);
			});
			fuelData?.forEach((f) => {
				const m = toMonth(f.created_at);
				if (!months[m]) months[m] = { revenue: 0, fuelCost: 0, maintenance: 0 };
				months[m].fuelCost += Number(f.cost);
			});
			maintData?.forEach((r) => {
				const m = toMonth(r.created_at);
				if (!months[m]) months[m] = { revenue: 0, fuelCost: 0, maintenance: 0 };
				months[m].maintenance += Number(r.cost);
			});
			setFinancialsData(
				Object.entries(months).map(([month, d]) => ({
					month,
					revenue: Math.round(d.revenue),
					fuelCost: Math.round(d.fuelCost),
					maintenance: Math.round(d.maintenance),
					netProfit: Math.round(d.revenue - d.fuelCost - d.maintenance),
				})),
			);
		};
		fetchChartData();
	}, []);

	const exportToCSV = () => {
		if (financialsData.length === 0) {
			alert("No data to export");
			return;
		}

		// Create CSV content
		const headers = [
			"Month",
			"Revenue (₹)",
			"Fuel Cost (₹)",
			"Maintenance (₹)",
			"Net Profit (₹)",
		];
		const rows = financialsData.map((f) => [
			f.month,
			f.revenue,
			f.fuelCost,
			f.maintenance,
			f.netProfit,
		]);

		const csvContent = [
			headers.join(","),
			...rows.map((row) => row.join(",")),
			"",
			"Summary Statistics",
			`Total Fuel Cost,₹${stats.totalFuelCost}`,
			`Total Maintenance Cost,₹${stats.totalMaintenanceCost}`,
			`Fleet ROI,${stats.fleetROI}%`,
			`Utilization Rate,${stats.utilizationRate}%`,
		].join("\n");

		// Create download link
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`fleet-analytics-${new Date().toISOString().split("T")[0]}.csv`,
		);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const kpis = [
		{
			label: "Total Fuel Cost",
			value: `₹${stats.totalFuelCost.toLocaleString("en-IN")}`,
			icon: IndianRupee,
		},
		{ label: "Fleet ROI", value: `${stats.fleetROI}%`, icon: TrendingUp },
		{
			label: "Utilization Rate",
			value: `${stats.utilizationRate}%`,
			icon: Gauge,
		},
	];

	return (
		<div className='space-y-6'>
			{/* KPI Cards */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{kpis.map((kpi) => (
					<div
						key={kpi.label}
						className='glass rounded-xl p-6 neon-border flex flex-col items-center gap-3 bg-card/40 backdrop-blur-md'>
						<kpi.icon className='h-8 w-8 text-primary drop-shadow-[0_0_8px_rgba(255,107,31,0.5)]' />
						<span className='text-sm text-muted-foreground uppercase tracking-wider'>
							{kpi.label}
						</span>
						<span className='text-3xl font-bold neon-text'>{kpi.value}</span>
					</div>
				))}
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<div className='glass rounded-xl p-6 neon-border bg-card/30'>
					<h3 className='text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider'>
						Avg Liters / Fill-up by Month
					</h3>
					<ResponsiveContainer width='100%' height={250}>
						<LineChart data={fuelEfficiencyData}>
							<CartesianGrid strokeDasharray='3 3' stroke='hsl(0 0% 12%)' />
							<XAxis dataKey='month' stroke='hsl(0 0% 55%)' fontSize={12} />
							<YAxis stroke='hsl(0 0% 55%)' fontSize={12} />
							<Tooltip
								contentStyle={{
									background: "hsl(0 0% 5%)",
									border: "1px solid hsl(25 95% 53% / 0.3)",
									borderRadius: "8px",
								}}
							/>
							<Line
								type='monotone'
								dataKey='mpg'
								stroke='hsl(25 95% 53%)'
								strokeWidth={2}
								dot={{ fill: "hsl(25 95% 53%)" }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>

				<div className='glass rounded-xl p-6 neon-border bg-card/30'>
					<h3 className='text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider'>
						Costliest Vehicles
					</h3>
					<ResponsiveContainer width='100%' height={250}>
						<BarChart data={costliestVehiclesData}>
							<CartesianGrid strokeDasharray='3 3' stroke='hsl(0 0% 12%)' />
							<XAxis dataKey='vehicle' stroke='hsl(0 0% 55%)' fontSize={12} />
							<YAxis stroke='hsl(0 0% 55%)' fontSize={12} />
							<Tooltip
								contentStyle={{
									background: "hsl(0 0% 5%)",
									border: "1px solid hsl(25 95% 53% / 0.3)",
									borderRadius: "8px",
								}}
							/>
							<Bar
								dataKey='cost'
								fill='hsl(25 95% 53%)'
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Financial Summary */}
			<div className='glass rounded-xl neon-border overflow-hidden bg-card/30'>
				<div className='p-4 border-b border-border/30 flex justify-between items-center'>
					<h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
						Financial Summary
					</h3>
					<Button onClick={exportToCSV} size='sm' className='neon-button gap-2'>
						<Download className='h-4 w-4' />
						Export CSV
					</Button>
				</div>
				<Table>
					<TableHeader>
						<TableRow className='border-border/30 hover:bg-transparent'>
							<TableHead className='text-muted-foreground'>Month</TableHead>
							<TableHead className='text-muted-foreground text-right'>
								Revenue
							</TableHead>
							<TableHead className='text-muted-foreground text-right'>
								Fuel Cost
							</TableHead>
							<TableHead className='text-muted-foreground text-right'>
								Maintenance
							</TableHead>
							<TableHead className='text-muted-foreground text-right'>
								Net Profit
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{financialsData.map((f) => (
							<TableRow
								key={f.month}
								className='border-border/20 table-row-hover transition-colors'>
								<TableCell className='font-medium'>{f.month}</TableCell>
								<TableCell className='text-right text-orange-400'>
									₹{f.revenue.toLocaleString("en-IN")}
								</TableCell>
								<TableCell className='text-right text-red-400'>
									₹{f.fuelCost.toLocaleString("en-IN")}
								</TableCell>
								<TableCell className='text-right text-yellow-400'>
									₹{f.maintenance.toLocaleString("en-IN")}
								</TableCell>
								<TableCell className='text-right font-bold neon-text'>
									₹{f.netProfit.toLocaleString("en-IN")}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
