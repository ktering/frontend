import { useState, useEffect } from "react";
import AdminOrdersTabs from "../../components/admin/orders/OrderTabs";
import AdminOrderCard from "../../components/admin/orders/OrderCard";
import { fetchAdminOrders, sendAdminChefSliceAction } from "../../api/adminOrders";
import Sidebar from "../../components/admin/Sidebar";

export default function Orders() {
  const [active, setActive] = useState("ready_for_pickup");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const loadOrders = async (status) => {
    setLoading(true);
    setErr("");
    try {
      const data = await fetchAdminOrders(status);
      setOrders(data);
    } catch (e) {
      setErr(e?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(active);
  }, [active]);

  const sliceMatchesTab = (status, tab) => {
  if (tab === "ready_for_pickup") return status === "ready_for_pickup";
  if (tab === "picked_up")        return status === "picked_up";
  if (tab === "delivered")        return status === "delivered";
  if (tab === "confirmed")        return status === "confirmed";
  if (tab === "pending")          return status === "pending";
  if (tab === "rejected")         return status === "rejected";
  return true;
};

const buildChefSlices = (orders, tab) =>
  (orders || []).flatMap((o) =>
    (o.chefOrders || [])
      .filter((co) => sliceMatchesTab(co.status, tab))
      .map((co) => ({
        orderMeta: {
          orderId: o.orderId,
          orderCode: o.orderCode,
          customer: o.customer,
          createdAt: o.createdAt,
          paymentStatus: o.paymentStatus,
          orderStatus: o.status,     // for partial badges
        },
        chefOrder: {
          chefId: co.chefId,            // ← use the one from backend
          chefOrderId: co.chefOrderId,  // (optional) keep if you want to show it
          ...co,
        },
      }))
  );
  const handleAssignDriver = async (orderId, chefOrderId) => {
  try {
    await sendAdminChefSliceAction(orderId, chefOrderId, { action: "assign_driver" });
    loadOrders(active);
  } catch (e) {
    alert(e?.message || "Failed to assign driver");
  }
};

const handleMarkDelivered = async (orderId, chefOrderId) => {
  try {
    await sendAdminChefSliceAction(orderId, chefOrderId, { action: "mark_delivered" });
    loadOrders(active);
  } catch (e) {
    alert(e?.message || "Failed to mark delivered");
  }
};
const slices = buildChefSlices(orders, active);


  return (
   <div className="flex bg-gray-50 min-h-screen">
         {/* Sidebar */}
         <Sidebar />
   
         {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
      <AdminOrdersTabs active={active} onChange={setActive} />

      {err && <div className="text-red-600 mb-4">{err}</div>}

      {loading ? (
        <div className="text-gray-500">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500">No orders in this list.</div>
      ) : (
        <div className="grid gap-4">
          {slices.map((s) => (
      <AdminOrderCard
        key={`${s.orderMeta.orderId}-${s.chefOrder.id}`}
        slice={s}
        tab={active}
        onAssignDriver={(orderId, chefId) => handleAssignDriver(orderId, chefId)}
        onMarkDelivered={(orderId, chefId) => handleMarkDelivered(orderId, chefId)}
      />
    ))}
        </div>
      )}
    </main>
    </div>
  );
}
