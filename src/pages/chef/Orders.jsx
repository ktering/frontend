import { useEffect, useState } from "react";
import ChefLayout from "../../components/chef/chefLayout";
import OrdersTabs from "../../components/chef/orders/OrdersTab";
import OrderCard from "../../components/chef/orders/OrderCard";
import { fetchChefOrders, sendOrderAction } from "../../api/chefOrders";

const DEFAULT_TAB = "pending";

export default function Orders() {
  const [active, setActive] = useState(DEFAULT_TAB);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async (status) => {
    setLoading(true);
    setErr("");
    try {
      const data = await fetchChefOrders(status);
      setOrders(data);
    } catch (e) {
      setErr(e?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(active); }, [active]);

  const doAction = async (id, action) => {
    try {
      await sendOrderAction(id, action);
      // Optimistic: remove from current tab; it will appear in next tab on next load
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (e) {
      alert(e?.message || "Could not update order");
    }
  };

  return (
    <ChefLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <OrdersTabs active={active} onChange={setActive} />

      {err && <div className="text-red-600 mb-4">{err}</div>}

      {loading ? (
        <div className="text-gray-500">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500">No orders in this list.</div>
      ) : (
        <div className="grid gap-4">
          {orders.map((o) => (
            <OrderCard
              key={o._id}
              order={o}
              tab={active}
              onAccept={() => doAction(o._id, "accept")}
              onReject={() => doAction(o._id, "reject")}
              onDeliver={() => doAction(o._id, "deliver")}
            />
          ))}
        </div>
      )}
    </ChefLayout>
  );
}
