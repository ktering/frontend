// src/pages/chef/Orders.jsx
import { useState, useEffect } from "react";
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
  const [actionLoading, setActionLoading] = useState({});

  // Accept prep time modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [prepTime, setPrepTime] = useState("");

  // Reject confirmation modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectOrderId, setRejectOrderId] = useState(null);

  // Success toast
  const [successModal, setSuccessModal] = useState({ open: false, message: "" });

  const load = async (status) => {
    setLoading(true);
    setErr("");
    try {
      const data = await fetchChefOrders(status); // backend already filters by chef + status
      setOrders(data);
    } catch (e) {
      setErr(e?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(active);
  }, [active]);

  const showSuccess = (msg) => {
    setSuccessModal({ open: true, message: msg });
    setTimeout(() => setSuccessModal({ open: false, message: "" }), 3000);
  };

  // Open Accept modal
  const onAcceptClick = (orderId) => {
    setSelectedOrderId(orderId);
    setPrepTime("");
    setModalOpen(true);
  };

  const handlePrepTimeSubmit = async () => {
  const num = Number(prepTime);
  if (!num || num <= 0) {
    alert("Please enter a valid positive number for prep time.");
    return;
  }

  const key = `${selectedOrderId}-accept`;
  setActionLoading(prev => ({ ...prev, [key]: true }));

  try {
    await sendOrderAction(selectedOrderId, { action: "accept", avgPrepTime: num });
    setOrders(prev => prev.filter(o => o.orderId !== selectedOrderId));
    showSuccess("Order accepted successfully.");
  } catch (e) {
    alert(e?.message || "Failed to accept order.");
  } finally {
    setActionLoading(prev => ({ ...prev, [key]: false }));
    setModalOpen(false);
    setSelectedOrderId(null);
  }
};

  // Open Reject modal
  const onRejectClick = (orderId) => {
    setRejectOrderId(orderId);
    setRejectModalOpen(true);
  };

  const onDeliverClick = async (orderId) => {
    try {
      await sendOrderAction(orderId, { action: "mark_ready" });
      setOrders((prev) => prev.filter((o) => o.orderId !== orderId)); // ← orderId
      showSuccess("Order marked as ready for delivery.");
    } catch (e) {
      alert(e?.message || "Failed to mark order as ready for delivery.");
    }
  };

  const confirmReject = async () => {
  if (!rejectOrderId) return;

  const key = `${rejectOrderId}-reject`;
  setActionLoading(prev => ({ ...prev, [key]: true }));

  try {
    await sendOrderAction(rejectOrderId, { action: "reject" });
    setOrders(prev => prev.filter(o => o.orderId !== rejectOrderId));
    showSuccess("Order rejected successfully.");
  } catch (e) {
    alert(e?.message || "Failed to reject order.");
  } finally {
    setActionLoading(prev => ({ ...prev, [key]: false }));
    setRejectModalOpen(false);
    setRejectOrderId(null);
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
            // <OrderCard
            //   key={o.orderId}                   // ← orderId
            //   order={o}                          // OrderCard should use o.chefOrder.status/items
            //   tab={active}
            //   onAccept={() => onAcceptClick(o.orderId)}   // ← orderId
            //   onReject={() => onRejectClick(o.orderId)}   // ← orderId
            //   onDeliver={() => onDeliverClick(o.orderId)} // ← orderId
            // />
            <OrderCard
  key={o.orderId}
  order={o}
  tab={active}
  onAccept={() => onAcceptClick(o.orderId)}
  onReject={() => onRejectClick(o.orderId)}
  onDeliver={() => onDeliverClick(o.orderId)}
  loading={{
    accept: !!actionLoading[`${o.orderId}-accept`],
    reject: !!actionLoading[`${o.orderId}-reject`],
    deliver: !!actionLoading[`${o.orderId}-deliver`],
  }}
/>

          ))}
        </div>
      )}

      {/* Accept Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-80 relative font-nunito"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-primary text-2xl font-bold"
              onClick={() => setModalOpen(false)}
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-2 text-black">Enter Average Prep Time</h2>
            <p className="text-sm text-gray-600 mb-4">Please enter the time in <strong>minutes</strong>.</p>
            <input
              type="number"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-1 text-black"
              placeholder="Minutes (e.g. 30)"
              value={prepTime}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) setPrepTime(val);
              }}
              min="1"
              step="1"
              autoFocus
            />
            <p className="text-xs text-gray-500 mb-4">
              Enter a whole number representing the average preparation time in minutes.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
             <button
  className="px-4 py-2 rounded bg-primary text-white hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
  onClick={handlePrepTimeSubmit}
  disabled={actionLoading[`${selectedOrderId}-accept`]}
>
  {actionLoading[`${selectedOrderId}-accept`] && (
    <svg className="w-4 h-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
    </svg>
  )}
  {actionLoading[`${selectedOrderId}-accept`] ? "Submitting..." : "Submit"}
</button>


            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {rejectModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setRejectModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-80 relative font-nunito"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-primary text-2xl font-bold"
              onClick={() => setRejectModalOpen(false)}
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-4 text-black">Confirm Reject Order</h2>
            <p className="mb-6 text-black">Are you sure you want to reject this order? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
                onClick={() => setRejectModalOpen(false)}
              >
                Cancel
              </button>
             <button
  className="px-4 py-2 rounded bg-primary text-white hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
  onClick={confirmReject}
  disabled={actionLoading[`${rejectOrderId}-reject`]}
>
  {actionLoading[`${rejectOrderId}-reject`] && (
    <svg className="w-4 h-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
    </svg>
  )}
  {actionLoading[`${rejectOrderId}-reject`] ? "Rejecting..." : "Reject Order"}
</button>


            </div>
          </div>
        </div>
      )}

      {/* Success toast */}
      {successModal.open && (
        <div className="fixed bottom-6 right-6 bg-primary text-white px-6 py-3 rounded shadow-lg font-nunito z-50 animate-fadeInOut">
          {successModal.message}
        </div>
      )}

      <style>{`
        @keyframes fadeInOut {
          0%, 100% {opacity: 0; transform: translateY(20px);}
          10%, 90% {opacity: 1; transform: translateY(0);}
        }
        .animate-fadeInOut { animation: fadeInOut 3s ease forwards; }
      `}</style>
    </ChefLayout>
  );
}
