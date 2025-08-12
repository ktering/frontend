const TABS = [
  { key: "pending",   label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "delivered", label: "Past Orders" },
  { key: "cancelled", label: "Cancelled" },
];

export default function OrdersTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto">
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
