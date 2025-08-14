import { useEffect, useState } from "react";
import ChefLayout from "../../components/chef/chefLayout";
import { fetchChefOrders } from "../../api/chefOrders";

function currency(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}
function shortId(id) {
  return String(id).slice(-6).toUpperCase();
}
function fmt(d) {
  try { return new Date(d).toLocaleString(); } catch { return ""; }
}

export default function Earnings() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [delivered, setDelivered] = useState([]);
  const [confirmed, setConfirmed] = useState([]); // optional: not yet delivered

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true); setErr("");
      try {
        // Chef-slice fetched from backend; no recalculation on client
        const [del, conf] = await Promise.all([
          fetchChefOrders("delivered"),
          fetchChefOrders("confirmed"),
        ]);
        if (!alive) return;
        setDelivered(del || []);
        setConfirmed(conf || []);
      } catch (e) {
        setErr(e?.message || "Failed to load earnings");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Totals rely on server-provided `chefOrder.chefPayoutAmount`
  const totalPaidOut = delivered.reduce(
    (s, o) => s + Number(o?.chefOrder?.chefPayoutAmount || 0), 0
  );
  const totalUpcoming = confirmed.reduce(
    (s, o) => s + Number(o?.chefOrder?.chefPayoutAmount || 0), 0
  );

  return (
    <ChefLayout>
      <div className="mb-8 px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Earnings</h1>
        {err && <div className="text-red-600 text-sm mt-2">{err}</div>}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 sm:px-0">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <div className="text-sm text-gray-500">Total Earned (Delivered)</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{loading ? "…" : currency(totalPaidOut)}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <div className="text-sm text-gray-500">Upcoming (Confirmed)</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{loading ? "…" : currency(totalUpcoming)}</div>
        </div>
      </div>

      {/* Delivered list */}
      <div className="mt-10 px-4 sm:px-0">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Delivered Orders</h2>
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          {loading ? (
            <div className="text-gray-500">Loading…</div>
          ) : delivered.length === 0 ? (
            <div className="text-gray-500">No delivered orders yet.</div>
          ) : (
            <div className="flex flex-col divide-y">
              {delivered.map((o, idx) => (
                <div key={o.orderId || idx} className="py-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">Order #{shortId(o.orderId)}</span>
                    <span className="text-xs text-gray-500">{fmt(o.createdAt)}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">You received</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {currency(o?.chefOrder?.chefPayoutAmount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ChefLayout>
  );
}
