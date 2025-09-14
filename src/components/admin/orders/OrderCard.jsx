// src/components/admin/orders/AdminChefSliceCard.jsx
import StatusBadge from "../../chef/orders/StatusBadge";

export default function OrderCard({ slice, tab, onAssignDriver, onMarkDelivered }) {
  const { orderMeta, chefOrder } = slice;
  const when = new Date(orderMeta.createdAt).toLocaleString();

  const showPartialBadge = ["partially_confirmed", "partial_cancelled"].includes(orderMeta.orderStatus);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">Order</span>
          <span className="font-semibold">#{orderMeta.orderCode.toUpperCase()}</span>

          {/* Chef-level status is primary here */}
          <StatusBadge status={chefOrder.status} label={chefOrder.chefName} />

          {/* Optional: tiny order-level + partial badges */}
          {showPartialBadge && (
            <StatusBadge status={orderMeta.orderStatus} label="Order" />
          )}

          {orderMeta.paymentStatus && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              {orderMeta.paymentStatus}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500">{when}</div>
      </div>

      <div className="mt-4 grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
          <div className="text-sm text-gray-500">Customer</div>
          <div className="font-medium">{orderMeta.customer?.name}</div>
          <div className="text-sm text-gray-600">{orderMeta.customer?.address}</div>
          {orderMeta.customer?.phone && (
      <div className="text-sm text-gray-600">Phone: {orderMeta.customer?.phone}</div>
    )}
        </div>

        <div className="sm:col-span-2">
          <ul className="text-sm text-gray-800 space-y-1">
            {(chefOrder.items || []).map((it, i) => (
              <li key={i}>
                {it.name} × {it.quantity} — Kterer rate: ${Number(it.chefOriginalPrice).toFixed(2)}
              </li>
            ))}
          </ul>
          <div className="text-right text-sm text-gray-500">
            Kterer payout: ${Number(chefOrder.chefPayoutAmount || 0).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tab === "ready_for_pickup" && (
          <button
            onClick={() => onAssignDriver(slice.orderMeta.orderId, slice.chefOrder.chefId)}
            className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
          >
            Assign Driver
          </button>
        )}
        {tab === "picked_up" && (
          <button
            onClick={() => onMarkDelivered(slice.orderMeta.orderId, slice.chefOrder.chefId)}
            className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700"
          >
            Mark Delivered
          </button>
        )}
      </div>
    </div>
  );
}
