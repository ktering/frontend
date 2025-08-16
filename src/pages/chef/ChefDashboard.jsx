import { useEffect, useMemo, useState, useRef } from "react";
import ChefLayout from "../../components/chef/chefLayout";
import { FaClipboardList, FaClock, FaUtensils } from "react-icons/fa";
import { fetchChefOrders } from "../../api/chefOrders";
import { getDishesByChef } from "../../api/dish";
import { socket } from "../../utils/socket";
import { toast, Toaster } from "react-hot-toast";

function getChefIdFromToken() {
  const t = localStorage.getItem("token");
  if (!t) return null;
  try { return JSON.parse(atob(t.split(".")[1]))?.userId || null; }
  catch { return null; }
}
function shortId(id) { return String(id).slice(-6).toUpperCase(); }
function fmtWhen(d) { try { return new Date(d).toLocaleString(); } catch { return ""; } }
function statusChip(status) {
  const map = {
    pending: "text-yellow-600",
    confirmed: "text-blue-600",
    ready_for_pickup: "text-indigo-600",
    picked_up: "text-purple-600",
    delivered: "text-green-600",
    rejected: "text-red-600",
  };
  const cls = map[status] || "text-gray-600";
  return <span className={`${cls} font-bold text-sm sm:text-base`}>{(status || "").replaceAll("_", " ")}</span>;
}

const loadNotifiedOrders = () => {
  const today = new Date().toDateString();
  const lastReset = localStorage.getItem("notificationsLastReset");
  if (lastReset !== today) {
    localStorage.setItem("shownNotifications", JSON.stringify([]));
    localStorage.setItem("notificationsLastReset", today);
    return new Set();
  }
  try { return new Set(JSON.parse(localStorage.getItem("shownNotifications") || "[]")); }
  catch { return new Set(); }
};
const saveNotifiedOrders = (setObj) => { localStorage.setItem("shownNotifications", JSON.stringify([...setObj])); };

export default function ChefDashboard() {
  const chefName = localStorage.getItem("chefName") || "Chef";
  const chefId = useMemo(() => getChefIdFromToken(), []);

  const [counts, setCounts] = useState({ delivered: 0, pending: 0, dishes: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const notificationSound = useMemo(() => new Audio("/notification.wav"), []);
  const notifiedOrdersRef = useRef(loadNotifiedOrders());

  // --- Handle socket notifications only
  useEffect(() => {
    if (!chefId) return;

    const handleNewOrder = (order) => {
      if (notifiedOrdersRef.current.has(order.orderCode)) return;
      notifiedOrdersRef.current.add(order.orderCode);
      saveNotifiedOrders(notifiedOrdersRef.current);

      toast.success(`New order #${shortId(order.orderCode)} from ${order.customerName || "Customer"}`);
      notificationSound.play().catch(() => console.log("🔔 Sound blocked"));

      if ("Notification" in window && Notification.permission === "granted") {
        try {
          new Notification(`New order #${shortId(order.orderCode)}`, {
            body: `From: ${order.customerName || "Customer"}\nItems: ${order.chefOrder?.items?.length || 0}`,
            icon: "/logo192.png",
          });
        } catch { /* ignore */ }
      }
    };

    socket.on("new_order", handleNewOrder);
    return () => socket.off("new_order", handleNewOrder);
  }, [chefId, notificationSound]);

  // --- Initial dashboard fetch (backend recent orders only)
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true); setErr("");
      try {
        const [pending, delivered, allOrders, dishesRes] = await Promise.all([
          fetchChefOrders("pending"),
          fetchChefOrders("delivered"),
          fetchChefOrders(),
          chefId ? getDishesByChef(chefId) : Promise.resolve([]),
        ]);
        if (!alive) return;

        const recent3 = [...(allOrders || [])]
          .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0,3);

        setCounts({
          pending: pending.length,
          delivered: delivered.length,
          dishes: Array.isArray(dishesRes) ? dishesRes.length : (dishesRes?.length || 0),
        });
        setRecent(recent3);
      } catch (e) { console.error(e); setErr(e?.message || "Failed to load dashboard"); }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [chefId]);

  const stats = [
    { id: 1, title: "Orders Completed", value: counts.delivered, icon: <FaClipboardList className="text-xl sm:text-2xl text-red-600" /> },
    { id: 2, title: "Pending Orders", value: counts.pending, icon: <FaClock className="text-xl sm:text-2xl text-yellow-500" /> },
    { id: 3, title: "Total Dishes", value: counts.dishes, icon: <FaUtensils className="text-xl sm:text-2xl text-green-600" /> },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <ChefLayout>
        <div className="mb-8 px-4 sm:px-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 truncate">
            Welcome back, {chefName}!
          </h1>
          {err && <div className="text-red-600 text-sm">{err}</div>}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
          {stats.map(({id,title,value,icon}) => (
            <div key={id} className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex items-center gap-4 hover:shadow-lg transition-shadow border border-gray-100">
              <div className="p-3 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">{icon}</div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm sm:text-base font-semibold text-gray-700 truncate">{title}</h2>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">{loading ? "…" : value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders (backend only) */}
        <div className="mt-12 px-4 sm:px-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
          <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            {loading ? <div className="text-gray-500">Loading…</div> :
            recent.length===0 ? <div className="text-gray-500">No recent orders.</div> :
            <div className="flex flex-col gap-4">
              {recent.map((o,idx)=>{
                const items=o.chefOrder?.items||[];
                const itemCount = items.reduce((s,i)=>s+Number(i.quantity||0),0);
                return (
                  <div key={o.orderId||idx} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center ${idx<recent.length-1?"border-b pb-3":""}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700 text-sm sm:text-base">Order #{shortId(o.orderId)}</span>
                      <span className="text-gray-400 text-xs sm:text-sm">{itemCount} {itemCount===1?"item":"items"}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                      {statusChip(o.chefOrder?.status)}
                      <span className="text-gray-500 text-xs sm:text-sm">{fmtWhen(o.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>}
          </div>
        </div>
      </ChefLayout>
    </>
  );
}
