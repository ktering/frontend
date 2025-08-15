import { useState, useEffect } from "react";
import AdminOrdersTabs from "../../components/admin/orders/OrderTabs";
import AdminOrderCard from "../../components/admin/orders/OrderCard";
import { fetchAdminOrders, sendAdminOrderAction } from "../../api/adminOrders";

export default function Orders() {
  const [active, setActive] = useState("in_delivery");
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

  const handleAssignDriver = async (orderId) => {
    try {
      await sendAdminOrderAction(orderId, { action: "assign_driver" }); // uses hard-coded driver on backend
      loadOrders(active);
    } catch (e) {
      alert(e?.message || "Failed to assign driver");
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      await sendAdminOrderAction(orderId, { action: "mark_delivered" });
      loadOrders(active);
    } catch (e) {
      alert(e?.message || "Failed to mark delivered");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
      <AdminOrdersTabs active={active} onChange={setActive} />

      {err && <div className="text-red-600 mb-4">{err}</div>}

      {loading ? (
        <div className="text-gray-500">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500">No orders in this list.</div>
      ) : (
        <div className="grid gap-4">
          {orders.map((o) => (
            <AdminOrderCard
              key={o.orderId}
              order={o}
              tab={active}
              onAssignDriver={handleAssignDriver}
              onMarkDelivered={handleMarkDelivered}
            />
          ))}
        </div>
      )}
    </div>
  );
}
