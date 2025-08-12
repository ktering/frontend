import StatusBadge from "./StatusBadge";

function maskPhone(phone) {
  if (!phone) return "";
  return String(phone).replace(/.(?=.{4})/g, "•");
}

export default function OrderCard({ order, tab, onAccept, onReject, onDeliver }) {
  const idShort = String(order._id).slice(-6).toUpperCase();
  const when = new Date(order.createdAt).toLocaleString();
  const items = order.items || [];
  const itemCount = items.reduce((s, i) => s + Number(i.quantity), 0);

  // If server didn't compute totals for chef, compute now (API already tries, but this is safe)
  const subtotalForChef = typeof order.subtotalForChef === "number"
    ? order.subtotalForChef
    : items.reduce((s, i) => s + Number(i.price) * Number(i.quantity), 0);

  const payoutForChef = typeof order.payoutForChef === "number"
    ? order.payoutForChef
    : items.reduce((s, i) => s + Number(i.payoutAmount || 0), 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Order</span>
          <span className="font-semibold">#{idShort}</span>
          <StatusBadge status={order.status} />
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
          <div className="text-sm text-gray-600">{maskPhone(order.customer?.phone)}</div>
        </div>

        <div className="sm:col-span-2">
          <div className="text-sm text-gray-500 mb-1">Items ({itemCount})</div>
          <ul className="text-sm text-gray-800 space-y-1">
            {items.map((it, idx) => (
              <li key={idx} className="flex justify-between">
                <span className="truncate">{it.name} × {it.quantity}</span>
                <span>${(Number(it.price) * Number(it.quantity)).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          {/* Totals for this chef */}
          <div className="mt-3 flex justify-end gap-6 text-sm">
            <div className="text-gray-600">Subtotal:</div>
            <div className="font-semibold">${subtotalForChef.toFixed(2)}</div>
            <div className="text-gray-600">Payout:</div>
            <div className="font-semibold">${payoutForChef.toFixed(2)}</div>
          </div>
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
            Mark Delivered
          </button>
        )}
      </div>
    </div>
  );
}
