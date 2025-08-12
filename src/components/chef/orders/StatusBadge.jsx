export default function StatusBadge({ status }) {
  const map = {
    pending:   "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${map[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}
