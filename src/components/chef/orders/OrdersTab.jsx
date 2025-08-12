const TABS = [
  { key: "pending",   label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "delivered", label: "Past Orders" },
  { key: "rejected", label: "Rejected" },
];
export default function OrdersTabs({ active, onChange }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
      {TABS.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-4 py-2 rounded-full border ${
            active === t.key
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-800 border-gray-200 hover:border-gray-300"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}