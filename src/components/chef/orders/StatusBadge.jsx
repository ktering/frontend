export default function StatusBadge({ status, label }) {
  const map = {
    pending:           "bg-yellow-100 text-yellow-800",
    confirmed:         "bg-blue-100 text-blue-800",
    ready_for_pickup:  "bg-indigo-100 text-indigo-800",
    picked_up:         "bg-purple-100 text-purple-800",
    delivered:         "bg-green-100 text-green-800",
    rejected:          "bg-red-100 text-red-700",
    in_delivery:       "bg-sky-100 text-sky-800",
    partial_cancelled: "bg-orange-100 text-orange-800",
    cancelled:         "bg-red-100 text-red-700",
  };
  const cls = map[status] || "bg-gray-100 text-gray-700";
  const text = String(status || "").replaceAll("_", " ");
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${cls}`}>
      {label && <strong>{label}:</strong>} {text}
    </span>
  );
}
