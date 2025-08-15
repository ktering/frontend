export default function OrdersTabs({ active, onChange }) {
  const TABS = [
    { key: "pending",          label: "Pending" },
    { key: "confirmed",        label: "Confirmed" },
    { key: "ready_for_pickup", label: "Ready for Pickup" },
    { key: "picked_up",        label: "Out for Delivery" },
    { key: "completed",        label: "Completed" },
    { key: "rejected",         label: "Rejected" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
      {TABS.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          aria-pressed={active === t.key}
          className={`px-4 py-2 rounded-full border transition-colors ${
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
