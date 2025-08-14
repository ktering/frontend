import StatusBadge from "./StatusBadge";

export default function OrderCard({ order, tab, onAccept, onReject, onDeliver }) {
  const when = new Date(order.createdAt).toLocaleString();

  // ⬇️ Chef-centric slice from backend
  const chefOrder  = order.chefOrder || {};
  const items      = chefOrder.items || [];
  const chefStatus = chefOrder.status || order.status;

  // ⬇️ What the chef will get (server-provided total for this chef)
  const chefPayoutTotal =
    typeof chefOrder.chefPayoutAmount === "number" ? chefOrder.chefPayoutAmount : undefined;

  const itemCount = items.reduce((s, i) => s + Number(i.quantity || 0), 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Order</span>
          <span className="font-semibold">#{order.orderCode.toUpperCase()}</span>

          {/* Show chef's own status */}
          <StatusBadge status={chefStatus} label="Chef" />

          {/* Optionally show platform-wide status if you pass it */}
          {order.overallStatus && <StatusBadge status={order.chefOrder?.status} label="Order" />}

          {order.paymentStatus && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              {order.paymentStatus}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500">{when}</div>
      </div>

      {/* Customer + items */}
      <div className="mt-4 grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
          <div className="text-sm text-gray-500">Customer</div>
          <div className="font-medium">{order.customer?.name}</div>
          <div className="text-sm text-gray-600">{order.customer?.address}</div>
        </div>

        <div className="sm:col-span-2">
          <div className="text-sm text-gray-500 mb-1">Items ({itemCount})</div>

          <ul className="text-sm text-gray-800 space-y-2">
            {items.map((it, idx) => (
              <li key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <span className="truncate">
                  {it.name} × {it.quantity}
                </span>

                {/* Chef-facing money: your rate, not customer price */}
                <div className="text-right">
                  <div className="text-gray-700 font-medium">
                    Your rate: ${Number(it.chefOriginalPrice).toFixed(2)} each
                  </div>
                  {/* Optional small caption to contrast with customer view */}
                  {/* <div className="text-xs text-gray-500">Customer sees: ${Number(it.dishTaxPrice).toFixed(2)} each</div> */}
                </div>
              </li>
            ))}
          </ul>

          {/* What the chef will get (total) */}
          {typeof chefPayoutTotal === "number" && (
            <div className="mt-4 flex justify-end items-baseline gap-3">
              <div className="text-sm text-gray-600">You will receive:</div>
              <div className="text-lg font-semibold">${chefPayoutTotal.toFixed(2)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {tab === "pending" && (
          <>
            <button
              onClick={onAccept}
              className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700"
            >
              Accept
            </button>
            <button
              onClick={onReject}
              className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              Reject
            </button>
          </>
        )}
        {tab === "confirmed" && (
          <button
            onClick={onDeliver}
            className="px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90"
          >
            Mark Order as Ready for Delivery
          </button>
        )}
      </div>
    </div>
  );
}
