// src/pages/driver/DriverOrders.jsx
import React, { useEffect, useState } from "react";
import DriverLayout from "../../components/driver/Layout";
import { fetchDriverOrders } from "../../api/driver";

function fmt(d){ try{ return new Date(d).toLocaleString(); } catch { return ""; } }

export default function DriverOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true); setErr("");
      try {
        const data = await fetchDriverOrders("delivered");
        setOrders(data);
      } catch (e) {
        setErr(e?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <DriverLayout>
      <h1 className="text-2xl font-bold mb-6">Delivered Orders</h1>

      {err && <div className="text-red-600 mb-4">{err}</div>}
      {loading ? (
        <div className="text-gray-500">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500">No delivered orders yet.</div>
      ) : (
        <div className="grid gap-4">
          {orders.map((s, i) => (
            <div key={`${s.orderMeta.orderId}-${i}`} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-500">Order</span>
                  <span className="font-semibold">#{String(s.orderMeta.orderCode).toUpperCase()}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">delivered</span>
                </div>
                <div className="text-sm text-gray-500">
                  Delivered: {fmt(s.chefOrder.deliveredAt) || "—"}
                </div>
              </div>

              <div className="mt-4 grid sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Customer</div>
                  <div className="font-medium">{s.orderMeta.customer?.name}</div>
                  <div className="text-sm text-gray-600">{s.orderMeta.customer?.address}</div>
                </div>
                <div className="sm:col-span-2">
                  <ul className="text-sm text-gray-800 space-y-1">
                    {(s.chefOrder.items || []).map((it, j) => (
                      <li key={j}>{it.name} × {it.quantity} Price: ${Number(it.chefOriginalPrice || 0).toFixed(2)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DriverLayout>
  );
}
