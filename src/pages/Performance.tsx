import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Shield,
	ArrowUpDown,
	SlidersHorizontal,
	Layers,
	Search,
	UserPlus,
	AlertTriangle,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

type Driver = {
	id: string;
	full_name: string;
	license_number: string;
	license_expiry: string;
	allowed_vehicle_types: string[];
	status: string;
	safety_score: number;
	created_at: string;
	completionRate: number;
	totalTrips: number;
	completedTrips: number;
};

const STATUS_OPTIONS = ["all", "on_duty", "on_trip", "off_duty", "suspended"];
const SORT_OPTIONS = [
	{ value: "safety_score_desc", label: "Safety Score ↓" },
	{ value: "safety_score_asc", label: "Safety Score ↑" },
	{ value: "completion_desc", label: "Completion Rate ↓" },
	{ value: "completion_asc", label: "Completion Rate ↑" },
	{ value: "expiry_asc", label: "Expiry (Soonest First)" },
	{ value: "name_asc", label: "Name A → Z" },
];
const GROUP_OPTIONS = [
	{ value: "none", label: "No Grouping" },
	{ value: "status", label: "Group by Status" },
	{ value: "vehicle_type", label: "Group by Vehicle Type" },
	{ value: "score_band", label: "Group by Score Band" },
];

function expiryDaysLeft(date: string) {
	return Math.ceil(
		(new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
	);
}

function ScoreBadge({ score }: { score: number }) {
	if (score >= 95)
		return <span className='font-bold text-orange-400'>{score}</span>;
	if (score >= 85)
		return <span className='font-bold text-yellow-400'>{score}</span>;
	return <span className='font-bold text-red-400'>{score}</span>;
}

function StatusBadge({ status }: { status: string }) {
	const map: Record<string, string> = {
		on_duty: "bg-orange-500/10 text-orange-400 border-orange-500/20",
		on_trip: "bg-blue-500/10 text-blue-400 border-blue-500/20",
		off_duty: "bg-muted/40 text-muted-foreground border-border",
		suspended: "bg-red-500/10 text-red-400 border-red-500/20",
	};
	return (
		<span
			className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border font-medium ${map[status] || "bg-muted text-muted-foreground border-border"}`}>
			{status.replace("_", " ")}
		</span>
	);
}

function CompletionBar({ rate }: { rate: number }) {
	const color =
		rate >= 80 ? "bg-orange-500"
		: rate >= 50 ? "bg-yellow-500"
		: "bg-red-500";
	return (
		<div className='flex items-center gap-2 min-w-[100px]'>
			<div className='flex-1 h-1.5 bg-muted rounded-full overflow-hidden'>
				<div
					className={`h-full rounded-full transition-all ${color}`}
					style={{ width: `${rate}%` }}
				/>
			</div>
			<span className='text-xs tabular-nums w-8 text-right'>{rate}%</span>
		</div>
	);
}

export default function Performance() {
	const [drivers, setDrivers] = useState<Driver[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [showControls, setShowControls] = useState(false);

	// Controls
	const [search, setSearch] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [sortBy, setSortBy] = useState("safety_score_desc");
	const [groupBy, setGroupBy] = useState("none");

	// Add Driver form
	const [name, setName] = useState("");
	const [license, setLicense] = useState("");
	const [expiry, setExpiry] = useState("");
	const [vtype, setVtype] = useState("truck");

	const fetchAll = async () => {
		setLoading(true);
		const [{ data: driverRows }, { data: tripRows }] = await Promise.all([
			supabase
				.from("drivers")
				.select("*")
				.order("created_at", { ascending: false }),
			supabase.from("trips").select("driver_id, status"),
		]);
		if (!driverRows) {
			setLoading(false);
			return;
		}

		const tripMap: Record<string, { total: number; completed: number }> = {};
		(tripRows || []).forEach((t) => {
			if (!tripMap[t.driver_id])
				tripMap[t.driver_id] = { total: 0, completed: 0 };
			tripMap[t.driver_id].total += 1;
			if (t.status === "completed") tripMap[t.driver_id].completed += 1;
		});

		setDrivers(
			driverRows.map((d) => {
				const s = tripMap[d.id] || { total: 0, completed: 0 };
				return {
					...d,
					completionRate:
						s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0,
					totalTrips: s.total,
					completedTrips: s.completed,
				};
			}),
		);
		setLoading(false);
	};

	useEffect(() => {
		fetchAll();
	}, []);

	const handleSave = async () => {
		if (!name || !license || !expiry) {
			toast.error("Fill all fields");
			return;
		}
		const { error } = await supabase.from("drivers").insert([
			{
				full_name: name,
				license_number: license,
				license_expiry: expiry,
				allowed_vehicle_types: [vtype],
				status: "on_duty",
			},
		]);
		if (error) {
			toast.error("Error: " + error.message);
			return;
		}
		toast.success("Driver added!");
		setShowForm(false);
		setName("");
		setLicense("");
		setExpiry("");
		fetchAll();
	};

	const filtered = useMemo(() => {
		let rows = [...drivers];
		if (filterStatus !== "all")
			rows = rows.filter((d) => d.status === filterStatus);
		if (search.trim()) {
			const q = search.toLowerCase();
			rows = rows.filter(
				(d) =>
					d.full_name.toLowerCase().includes(q) ||
					d.license_number.toLowerCase().includes(q),
			);
		}
		rows.sort((a, b) => {
			switch (sortBy) {
				case "safety_score_asc":
					return a.safety_score - b.safety_score;
				case "safety_score_desc":
					return b.safety_score - a.safety_score;
				case "completion_asc":
					return a.completionRate - b.completionRate;
				case "completion_desc":
					return b.completionRate - a.completionRate;
				case "expiry_asc":
					return (
						new Date(a.license_expiry).getTime() -
						new Date(b.license_expiry).getTime()
					);
				case "name_asc":
					return a.full_name.localeCompare(b.full_name);
				default:
					return 0;
			}
		});
		return rows;
	}, [drivers, search, filterStatus, sortBy]);

	const grouped = useMemo(() => {
		if (groupBy === "none") return { "All Drivers": filtered };
		const map: Record<string, Driver[]> = {};
		filtered.forEach((d) => {
			let key = "";
			if (groupBy === "status") key = d.status.replace("_", " ");
			else if (groupBy === "vehicle_type")
				key = (d.allowed_vehicle_types || []).join(", ") || "Unknown";
			else if (groupBy === "score_band")
				key =
					d.safety_score >= 95 ? "⭐ Excellent (95+)"
					: d.safety_score >= 85 ? "✅ Good (85–94)"
					: "⚠️ Needs Improvement (<85)";
			if (!map[key]) map[key] = [];
			map[key].push(d);
		});
		return map;
	}, [filtered, groupBy]);

	const expiryWarnings = drivers.filter(
		(d) => expiryDaysLeft(d.license_expiry) <= 90,
	);

	return (
		<div className='space-y-4'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Shield className='w-5 h-5 text-primary' />
					<h2 className='text-lg font-semibold'>
						Driver Performance &amp; Safety Profiles
					</h2>
					<span className='text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full'>
						{drivers.length} drivers
					</span>
				</div>
				<div className='flex gap-2'>
					<Button
						variant='outline'
						size='sm'
						className='gap-1.5 border-border/50'
						onClick={() => setShowControls((v) => !v)}>
						<SlidersHorizontal className='w-3.5 h-3.5' /> Filters &amp; Sort
					</Button>
					<Button
						className='neon-button gap-1.5'
						size='sm'
						onClick={() => setShowForm((v) => !v)}>
						<UserPlus className='w-3.5 h-3.5' /> Add Driver
					</Button>
				</div>
			</div>

			{/* Expiry warnings banner */}
			{expiryWarnings.length > 0 && (
				<div className='flex items-start gap-2 rounded-lg bg-orange-500/10 border border-orange-500/20 p-3 text-sm text-orange-300'>
					<AlertTriangle className='w-4 h-4 mt-0.5 shrink-0' />
					<span>
						<strong>{expiryWarnings.length}</strong> driver
						{expiryWarnings.length > 1 ? "s" : ""} with license expiring within
						90 days: {expiryWarnings.map((d) => d.full_name).join(", ")}
					</span>
				</div>
			)}

			{/* Filter / Sort / Group controls */}
			{showControls && (
				<div className='glass rounded-xl border border-border/40 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3'>
					<div className='space-y-1'>
						<label className='text-xs text-muted-foreground font-medium flex items-center gap-1'>
							<SlidersHorizontal className='w-3 h-3' /> Filter by Status
						</label>
						<Select value={filterStatus} onValueChange={setFilterStatus}>
							<SelectTrigger className='glass border-border/40 h-8 text-sm'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent className='bg-popover border-border text-popover-foreground'>
								{STATUS_OPTIONS.map((s) => (
									<SelectItem key={s} value={s}>
										{s === "all" ? "All Statuses" : s.replace("_", " ")}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className='space-y-1'>
						<label className='text-xs text-muted-foreground font-medium flex items-center gap-1'>
							<ArrowUpDown className='w-3 h-3' /> Sort by
						</label>
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className='glass border-border/40 h-8 text-sm'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent className='bg-popover border-border text-popover-foreground'>
								{SORT_OPTIONS.map((o) => (
									<SelectItem key={o.value} value={o.value}>
										{o.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className='space-y-1'>
						<label className='text-xs text-muted-foreground font-medium flex items-center gap-1'>
							<Layers className='w-3 h-3' /> Group by
						</label>
						<Select value={groupBy} onValueChange={setGroupBy}>
							<SelectTrigger className='glass border-border/40 h-8 text-sm'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent className='bg-popover border-border text-popover-foreground'>
								{GROUP_OPTIONS.map((o) => (
									<SelectItem key={o.value} value={o.value}>
										{o.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			)}

			<div className='flex gap-4'>
				{/* Add Driver Panel */}
				{showForm && (
					<div className='w-72 shrink-0 glass rounded-xl border border-border/40 p-5 space-y-3 self-start'>
						<h3 className='font-semibold text-sm'>New Driver</h3>
						<Input
							placeholder='Full Name'
							value={name}
							onChange={(e) => setName(e.target.value)}
							className='glass border-border/40 h-8 text-sm'
						/>
						<Input
							placeholder='License # e.g. DL-0120110012340'
							value={license}
							onChange={(e) => setLicense(e.target.value)}
							className='glass border-border/40 h-8 text-sm'
						/>
						<div className='space-y-1'>
							<label className='text-xs text-muted-foreground'>
								License Expiry
							</label>
							<Input
								type='date'
								value={expiry}
								onChange={(e) => setExpiry(e.target.value)}
								className='glass border-border/40 h-8 text-sm'
							/>
						</div>
						<Select value={vtype} onValueChange={setVtype}>
							<SelectTrigger className='glass border-border/40 h-8 text-sm'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent className='bg-popover border-border text-popover-foreground'>
								<SelectItem value='truck'>Truck</SelectItem>
								<SelectItem value='van'>Van</SelectItem>
								<SelectItem value='bike'>Bike</SelectItem>
							</SelectContent>
						</Select>
						<div className='flex gap-2 pt-1'>
							<Button
								size='sm'
								className='flex-1 neon-button'
								onClick={handleSave}>
								Save
							</Button>
							<Button
								size='sm'
								variant='ghost'
								className='flex-1'
								onClick={() => setShowForm(false)}>
								Cancel
							</Button>
						</div>
					</div>
				)}

				{/* Table */}
				<div className='flex-1 space-y-3'>
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground' />
						<Input
							placeholder='Search by name or license #...'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className='glass border-border/40 pl-8 h-8 text-sm'
						/>
					</div>

					{loading ?
						<div className='glass rounded-xl border border-border/40 py-16 text-center text-muted-foreground text-sm'>
							Loading driver profiles...
						</div>
					:	Object.entries(grouped).map(([groupLabel, rows]) => (
							<div
								key={groupLabel}
								className='glass rounded-xl border border-border/40 overflow-hidden'>
								{groupBy !== "none" && (
									<div className='px-4 py-2 bg-muted/20 border-b border-border/30 text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2'>
										<Layers className='w-3 h-3' />
										{groupLabel}
										<span className='ml-auto normal-case font-normal'>
											{rows.length} driver{rows.length !== 1 ? "s" : ""}
										</span>
									</div>
								)}
								<Table>
									<TableHeader>
										<TableRow className='border-border/30 hover:bg-transparent'>
											<TableHead className='text-muted-foreground text-xs'>
												Driver
											</TableHead>
											<TableHead className='text-muted-foreground text-xs'>
												License #
											</TableHead>
											<TableHead className='text-muted-foreground text-xs'>
												Vehicle Types
											</TableHead>
											<TableHead className='text-muted-foreground text-xs'>
												Expiry
											</TableHead>
											<TableHead className='text-muted-foreground text-xs'>
												Completion Rate
											</TableHead>
											<TableHead className='text-muted-foreground text-xs text-center'>
												Safety Score
											</TableHead>
											<TableHead className='text-muted-foreground text-xs text-center'>
												Status
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{rows.length === 0 ?
											<TableRow>
												<TableCell
													colSpan={7}
													className='text-center py-10 text-muted-foreground text-sm'>
													No drivers match the current filters.
												</TableCell>
											</TableRow>
										:	rows.map((d) => {
												const days = expiryDaysLeft(d.license_expiry);
												const expiredClass =
													days <= 0 ? "text-red-400 font-bold"
													: days <= 90 ? "text-orange-400 font-semibold"
													: "";
												return (
													<TableRow
														key={d.id}
														className='border-border/20 hover:bg-white/[0.02] transition-colors'>
														<TableCell className='font-medium text-sm'>
															{d.full_name}
														</TableCell>
														<TableCell className='font-mono text-xs text-muted-foreground'>
															{d.license_number}
														</TableCell>
														<TableCell>
															<div className='flex flex-wrap gap-1'>
																{(d.allowed_vehicle_types || []).map((t) => (
																	<span
																		key={t}
																		className='text-xs bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded'>
																		{t}
																	</span>
																))}
															</div>
														</TableCell>
														<TableCell className={`text-sm ${expiredClass}`}>
															{d.license_expiry}
															{days <= 90 && days > 0 && (
																<span className='ml-1 text-xs opacity-70'>
																	({days}d)
																</span>
															)}
															{days <= 0 && (
																<span className='ml-1 text-xs'> EXPIRED</span>
															)}
														</TableCell>
														<TableCell>
															<div className='space-y-0.5'>
																<CompletionBar rate={d.completionRate} />
																<div className='text-xs text-muted-foreground'>
																	{d.completedTrips}/{d.totalTrips} trips
																</div>
															</div>
														</TableCell>
														<TableCell className='text-center'>
															<ScoreBadge score={Number(d.safety_score)} />
														</TableCell>
														<TableCell className='text-center'>
															<StatusBadge status={d.status} />
														</TableCell>
													</TableRow>
												);
											})
										}
									</TableBody>
								</Table>
							</div>
						))
					}
				</div>
			</div>
		</div>
	);
}
