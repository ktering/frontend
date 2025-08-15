import StatusBadge from "../../chef/orders/StatusBadge";

export default function OrderCard({ order, tab, onAssignDriver, onMarkDelivered }) {
  const when = new Date(order.createdAt).toLocaleString();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Order</span>
          <span className="font-semibold">#{order.orderCode.toUpperCase()}</span>
          <StatusBadge status={order.status} label="Order" />
          {order.paymentStatus && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              {order.paymentStatus}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500">{when}</div>
      </div>

      {/* Customer */}
      <div className="mt-4 grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
          <div className="text-sm text-gray-500">Customer</div>
          <div className="font-medium">{order.customer?.name}</div>
          <div className="text-sm text-gray-600">{order.customer?.address}</div>
        </div>

        {/* Chef Orders */}
        <div className="sm:col-span-2">
          {order.chefOrders.map((co, idx) => (
            <div key={idx} className="mb-4">
              <div className="font-medium text-gray-800">{co.chefName}</div>
              <ul className="text-sm text-gray-800 space-y-1">
                {co.items.map((it, i) => (
                  <li key={i}>
                    {it.name} × {it.quantity} — Chef rate: ${Number(it.chefOriginalPrice).toFixed(2)}
                  </li>
                ))}
              </ul>
              <div className="text-right text-sm text-gray-500">
                Chef payout: ${co.chefPayoutAmount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Driver */}
      {order.driver && (
        <div className="mt-3 text-sm text-gray-600">
          Driver: {order.driver.name} ({order.driver.phone})
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {tab === "ready_for_pickup" && (
          <button
            onClick={() => onAssignDriver(order.orderId)}
            className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
          >
            Assign Driver
          </button>
        )}
        {tab === "picked_up" && (
          <button
            onClick={() => onMarkDelivered(order.orderId)}
            className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700"
          >
            Mark Delivered
          </button>
        )}
      </div>
    </div>
  );
}
