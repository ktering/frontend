import { useEffect, useMemo, useState } from "react";
import ChefLayout from "../../components/chef/chefLayout";
import { FaClipboardList, FaClock, FaUtensils } from "react-icons/fa";
import { fetchChefOrders } from "../../api/chefOrders";
import { getDishesByChef } from "../../api/dish";

function getChefIdFromToken() {
  const t = localStorage.getItem("token");
  if (!t) return null;
  try {
    const payload = JSON.parse(atob(t.split(".")[1]));
    return payload?.userId || null;
  } catch {
    return null;
  }
}
function shortId(id) {
  return String(id).slice(-6).toUpperCase();
}
function fmtWhen(d) {
  try { return new Date(d).toLocaleString(); } catch { return ""; }
}
function statusChip(status) {
  const map = {
    delivered: "text-green-600",
    confirmed: "text-blue-600",
    pending: "text-yellow-600",
    cancelled: "text-red-600",
  };
  const cls = map[status] || "text-gray-600";
  const label = status?.[0]?.toUpperCase() + status?.slice(1);
  return <span className={`${cls} font-bold text-sm sm:text-base`}>{label}</span>;
}

export default function ChefDashboard() {
  const chefName = localStorage.getItem("chefName") || "Chef";
  const chefId = useMemo(() => getChefIdFromToken(), []);

  const [counts, setCounts] = useState({ delivered: 0, pending: 0, dishes: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        // parallel fetches
        const [pending, delivered, allOrders, dishesRes] = await Promise.all([
          fetchChefOrders("pending"),
          fetchChefOrders("delivered"),
          fetchChefOrders(), // all statuses for "Recent Orders"
          chefId ? getDishesByChef(chefId) : Promise.resolve([]),
        ]);

        if (!alive) return;

        const recent3 = [...(allOrders || [])]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);

        setCounts({
          pending: pending.length,
          delivered: delivered.length,
          dishes: Array.isArray(dishesRes) ? dishesRes.length : (dishesRes?.length || 0),
        });
        setRecent(recent3);
      } catch (e) {
        console.error(e);
        setErr(e?.message || "Failed to load dashboard");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [chefId]);

  const stats = [
    { id: 1, title: "Orders Completed", value: counts.delivered, icon: <FaClipboardList className="text-xl sm:text-2xl text-red-600" /> },
    { id: 2, title: "Pending Orders", value: counts.pending, icon: <FaClock className="text-xl sm:text-2xl text-yellow-500" /> },
    { id: 3, title: "Total Dishes", value: counts.dishes, icon: <FaUtensils className="text-xl sm:text-2xl text-green-600" /> },
  ];

  return (
    <ChefLayout>
      <div className="mb-8 px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 truncate">
          Welcome back, {chefName}!
        </h1>
        {err && <div className="text-red-600 text-sm">{err}</div>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
        {stats.map(({ id, title, value, icon }) => (
          <div
            key={id}
            className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex items-center gap-4 hover:shadow-lg transition-shadow border border-gray-100"
          >
            <div className="p-3 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm sm:text-base font-semibold text-gray-700 truncate">{title}</h2>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">
                {loading ? "…" : value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="mt-12 px-4 sm:px-0">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          {loading ? (
            <div className="text-gray-500">Loading…</div>
          ) : recent.length === 0 ? (
            <div className="text-gray-500">No recent orders.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {recent.map((o, idx) => {
                const items = o.items || [];
                const itemCount = items.reduce((s, i) => s + Number(i.quantity || 0), 0);
                return (
                  <div key={o._id || idx} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center ${idx < recent.length - 1 ? "border-b pb-3" : ""}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700 text-sm sm:text-base">Order #{shortId(o._id)}</span>
                      <span className="text-gray-400 text-xs sm:text-sm">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                      {statusChip(o.status)}
                      <span className="text-gray-500 text-xs sm:text-sm">{fmtWhen(o.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
</ChefLayout>
  );
}