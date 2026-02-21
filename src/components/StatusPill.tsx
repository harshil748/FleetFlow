export const getStatusColor = (status: string) => {
  const s = status.toLowerCase();
  if (["active", "available", "completed", "approved", "on_duty"].includes(s)) return "status-active";
  if (["maintenance", "in_shop", "in progress", "in review", "in transit", "on_trip"].includes(s)) return "status-warning";
  if (["idle", "pending", "scheduled"].includes(s)) return "status-info";
  if (["retired", "suspended", "cancelled"].includes(s)) return "status-danger";
  return "status-danger";
};

export default function StatusPill({ status }: { status: string }) {
  // Fix text formatting (e.g., 'on_trip' -> 'On Trip')
  const displayStatus = status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {displayStatus}
    </span>
  );
}
