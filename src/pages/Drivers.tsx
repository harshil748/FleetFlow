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
import { Pencil, Trash2, AlertTriangle, UserPlus, Search } from "lucide-react";
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
};

const STATUS_OPTIONS = [
	{ value: "on_duty", label: "On Duty" },
	{ value: "off_duty", label: "Off Duty" },
	{ value: "on_trip", label: "On Trip" },
	{ value: "suspended", label: "Suspended" },
];

function expiryDaysLeft(date: string) {
	return Math.ceil(
		(new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
	);
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

export default function Drivers() {
	const [drivers, setDrivers] = useState<Driver[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");

	// Form fields
	const [name, setName] = useState("");
	const [license, setLicense] = useState("");
	const [expiry, setExpiry] = useState("");
	const [vehicleTypes, setVehicleTypes] = useState<string[]>(["truck"]);
	const [status, setStatus] = useState("on_duty");

	const fetchDrivers = async () => {
		setLoading(true);
		const { data, error } = await supabase
			.from("drivers")
			.select("*")
			.order("created_at", { ascending: false });
		if (error) {
			toast.error("Failed to load drivers");
			console.error(error);
		} else {
			setDrivers(data || []);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchDrivers();
	}, []);

	const resetForm = () => {
		setName("");
		setLicense("");
		setExpiry("");
		setVehicleTypes(["truck"]);
		setStatus("on_duty");
		setEditingId(null);
		setShowForm(false);
	};

	const handleEdit = (driver: Driver) => {
		setEditingId(driver.id);
		setName(driver.full_name);
		setLicense(driver.license_number);
		setExpiry(driver.license_expiry);
		setVehicleTypes(driver.allowed_vehicle_types || ["truck"]);
		setStatus(driver.status);
		setShowForm(true);
	};

	const handleSave = async () => {
		if (!name || !license || !expiry) {
			toast.error("Please fill all required fields");
			return;
		}

		const driverData = {
			full_name: name,
			license_number: license,
			license_expiry: expiry,
			allowed_vehicle_types: vehicleTypes,
			status: status,
		};

		if (editingId) {
			// Update existing driver
			const { error } = await supabase
				.from("drivers")
				.update(driverData)
				.eq("id", editingId);

			if (error) {
				toast.error("Error updating driver: " + error.message);
			} else {
				toast.success("Driver updated successfully!");
				resetForm();
				fetchDrivers();
			}
		} else {
			// Create new driver
			const { error } = await supabase.from("drivers").insert([driverData]);

			if (error) {
				toast.error("Error adding driver: " + error.message);
			} else {
				toast.success("Driver added successfully!");
				resetForm();
				fetchDrivers();
			}
		}
	};

	const handleSuspend = async (driverId: string, currentStatus: string) => {
		const newStatus = currentStatus === "suspended" ? "off_duty" : "suspended";
		const { error } = await supabase
			.from("drivers")
			.update({ status: newStatus })
			.eq("id", driverId);

		if (error) {
			toast.error("Error updating driver status");
		} else {
			toast.success(
				newStatus === "suspended" ? "Driver suspended" : "Driver reactivated",
			);
			fetchDrivers();
		}
	};

	const handleDelete = async (driverId: string, driverName: string) => {
		if (
			!confirm(
				`Are you sure you want to delete driver "${driverName}"? This action cannot be undone.`,
			)
		) {
			return;
		}

		const { error } = await supabase
			.from("drivers")
			.delete()
			.eq("id", driverId);

		if (error) {
			toast.error("Error deleting driver: " + error.message);
		} else {
			toast.success("Driver deleted successfully");
			fetchDrivers();
		}
	};

	const toggleVehicleType = (type: string) => {
		if (vehicleTypes.includes(type)) {
			setVehicleTypes(vehicleTypes.filter((t) => t !== type));
		} else {
			setVehicleTypes([...vehicleTypes, type]);
		}
	};

	const filtered = useMemo(() => {
		let rows = [...drivers];
		if (filterStatus !== "all") {
			rows = rows.filter((d) => d.status === filterStatus);
		}
		if (search.trim()) {
			const q = search.toLowerCase();
			rows = rows.filter(
				(d) =>
					d.full_name.toLowerCase().includes(q) ||
					d.license_number.toLowerCase().includes(q),
			);
		}
		return rows;
	}, [drivers, search, filterStatus]);

	const expiryWarnings = drivers.filter(
		(d) => expiryDaysLeft(d.license_expiry) <= 90,
	);

	return (
		<div className='space-y-4'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<UserPlus className='w-5 h-5 text-primary' />
					<h2 className='text-lg font-semibold'>Driver Registry</h2>
					<span className='text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full'>
						{drivers.length} drivers
					</span>
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

			<div className='flex gap-6'>
				{/* Add/Edit Driver Form */}
				{showForm && (
					<div className='w-80 shrink-0 glass-strong rounded-2xl p-6 neon-border space-y-4 self-start bg-card/50 backdrop-blur-md'>
						<h3 className='text-lg font-bold neon-text'>
							{editingId ? "Edit Driver" : "New Driver Registration"}
						</h3>
						<div className='space-y-3'>
							<div className='space-y-1'>
								<label className='text-xs text-muted-foreground'>
									Full Name *
								</label>
								<Input
									placeholder='e.g., John Doe'
									value={name}
									onChange={(e) => setName(e.target.value)}
									className='glass border-border/40 focus:neon-border'
								/>
							</div>
							<div className='space-y-1'>
								<label className='text-xs text-muted-foreground'>
									License Number *
								</label>
								<Input
									placeholder='e.g., DL-0120110012340'
									value={license}
									onChange={(e) => setLicense(e.target.value)}
									className='glass border-border/40 focus:neon-border'
									disabled={!!editingId}
								/>
								{editingId && (
									<p className='text-xs text-muted-foreground'>
										License number cannot be changed
									</p>
								)}
							</div>
							<div className='space-y-1'>
								<label className='text-xs text-muted-foreground'>
									License Expiry *
								</label>
								<Input
									type='date'
									value={expiry}
									onChange={(e) => setExpiry(e.target.value)}
									className='glass border-border/40 focus:neon-border'
								/>
							</div>
							<div className='space-y-1'>
								<label className='text-xs text-muted-foreground'>
									Allowed Vehicle Types *
								</label>
								<div className='flex flex-wrap gap-2'>
									{["truck", "van", "bike"].map((type) => (
										<button
											key={type}
											type='button'
											onClick={() => toggleVehicleType(type)}
											className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
												vehicleTypes.includes(type) ?
													"bg-primary/20 text-primary border-primary/50 font-medium"
												:	"bg-muted/20 text-muted-foreground border-border/40 hover:border-border"
											}`}>
											{type.charAt(0).toUpperCase() + type.slice(1)}
										</button>
									))}
								</div>
							</div>
							<div className='space-y-1'>
								<label className='text-xs text-muted-foreground'>Status</label>
								<Select value={status} onValueChange={setStatus}>
									<SelectTrigger className='glass border-border/40 h-9 text-sm'>
										<SelectValue />
									</SelectTrigger>
									<SelectContent className='bg-popover border-border text-popover-foreground'>
										{STATUS_OPTIONS.map((opt) => (
											<SelectItem key={opt.value} value={opt.value}>
												{opt.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className='flex gap-3 pt-2'>
							<Button className='flex-1 neon-button' onClick={handleSave}>
								{editingId ? "Update" : "Save"}
							</Button>
							<Button
								variant='outline'
								onClick={resetForm}
								className='flex-1 border-destructive/50 text-destructive hover:bg-destructive/10'>
								Cancel
							</Button>
						</div>
					</div>
				)}

				{/* Driver Table */}
				<div className='flex-1 space-y-4'>
					<div className='flex items-center gap-3'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground' />
							<Input
								placeholder='Search by name or license...'
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className='glass border-border/40 pl-8 h-9 text-sm'
							/>
						</div>
						<Select value={filterStatus} onValueChange={setFilterStatus}>
							<SelectTrigger className='glass border-border/40 h-9 w-[140px] text-sm'>
								<SelectValue placeholder='Filter status' />
							</SelectTrigger>
							<SelectContent className='bg-popover border-border text-popover-foreground'>
								<SelectItem value='all'>All Statuses</SelectItem>
								{STATUS_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							className='neon-button'
							onClick={() => {
								resetForm();
								setShowForm(true);
							}}>
							+ New Driver
						</Button>
					</div>
					<div className='glass rounded-xl neon-border overflow-hidden bg-card/30'>
						<Table>
							<TableHeader>
								<TableRow className='border-border/30 hover:bg-transparent'>
									<TableHead className='text-muted-foreground text-xs'>
										Driver Name
									</TableHead>
									<TableHead className='text-muted-foreground text-xs'>
										License #
									</TableHead>
									<TableHead className='text-muted-foreground text-xs'>
										Vehicle Types
									</TableHead>
									<TableHead className='text-muted-foreground text-xs'>
										License Expiry
									</TableHead>
									<TableHead className='text-muted-foreground text-xs text-center'>
										Safety Score
									</TableHead>
									<TableHead className='text-muted-foreground text-xs text-center'>
										Status
									</TableHead>
									<TableHead className='text-muted-foreground text-xs text-right'>
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{loading ?
									<TableRow>
										<TableCell
											colSpan={7}
											className='text-center py-8 text-muted-foreground'>
											Loading drivers...
										</TableCell>
									</TableRow>
								: filtered.length === 0 ?
									<TableRow>
										<TableCell
											colSpan={7}
											className='text-center py-8 text-muted-foreground'>
											{search || filterStatus !== "all" ?
												"No drivers match your search or filter."
											:	"No drivers found. Add one to get started."}
										</TableCell>
									</TableRow>
								:	filtered.map((driver) => {
										const days = expiryDaysLeft(driver.license_expiry);
										const expiredClass =
											days <= 0 ? "text-red-400 font-bold"
											: days <= 90 ? "text-orange-400 font-semibold"
											: "";
										return (
											<TableRow
												key={driver.id}
												className='border-border/20 table-row-hover transition-colors'>
												<TableCell className='font-medium text-sm'>
													{driver.full_name}
												</TableCell>
												<TableCell className='font-mono text-xs text-muted-foreground'>
													{driver.license_number}
												</TableCell>
												<TableCell>
													<div className='flex flex-wrap gap-1'>
														{(driver.allowed_vehicle_types || []).map((t) => (
															<span
																key={t}
																className='text-xs bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded'>
																{t}
															</span>
														))}
													</div>
												</TableCell>
												<TableCell className={`text-sm ${expiredClass}`}>
													{driver.license_expiry}
													{days <= 90 && days > 0 && (
														<span className='ml-1 text-xs opacity-70'>
															({days}d)
														</span>
													)}
													{days <= 0 && (
														<span className='ml-1 text-xs'> EXPIRED</span>
													)}
												</TableCell>
												<TableCell className='text-center text-sm'>
													{driver.safety_score}
												</TableCell>
												<TableCell className='text-center'>
													<StatusBadge status={driver.status} />
												</TableCell>
												<TableCell className='text-right'>
													<div className='flex gap-1 justify-end'>
														<Button
															size='sm'
															variant='ghost'
															className='h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary'
															onClick={() => handleEdit(driver)}
															title='Edit driver'>
															<Pencil className='w-3.5 h-3.5' />
														</Button>
														<Button
															size='sm'
															variant='ghost'
															className={`h-7 w-7 p-0 ${
																driver.status === "suspended" ?
																	"hover:bg-orange-500/10 hover:text-orange-400"
																:	"hover:bg-yellow-500/10 hover:text-yellow-400"
															}`}
															onClick={() =>
																handleSuspend(driver.id, driver.status)
															}
															title={
																driver.status === "suspended" ?
																	"Reactivate driver"
																:	"Suspend driver"
															}>
															{driver.status === "suspended" ? "✓" : "⏸"}
														</Button>
														<Button
															size='sm'
															variant='ghost'
															className='h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive'
															onClick={() =>
																handleDelete(driver.id, driver.full_name)
															}
															title='Delete driver'>
															<Trash2 className='w-3.5 h-3.5' />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										);
									})
								}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}
