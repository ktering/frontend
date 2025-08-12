import { API_BASE } from "../../config";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

function getToken() {
  return localStorage.getItem("token"); // <- use the same key you set after login
}

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

function getChefIdFromToken() {
  const t = getToken();
  const payload = t ? parseJwt(t) : null;
  // your middleware uses payload.userId
  return payload?.userId || null;
}

// Ensure each order only contains items for this chef and compute per-chef totals
function shapeOrdersForChef(orders, chefId) {
  if (!chefId) return orders;
  return (orders || [])
    .map((o) => {
      const chefItems = (o.items || []).filter(
        (it) => String(it.chefId) === String(chefId) ||
                String(it.chefId?._id) === String(chefId) // just in case
      );
      if (chefItems.length === 0) return null; // this order doesn't involve this chef anymore

      const subtotalForChef = chefItems.reduce((s, i) => s + Number(i.price) * Number(i.quantity), 0);
      const payoutForChef   = chefItems.reduce((s, i) => s + Number(i.payoutAmount || 0), 0);

      return {
        ...o,
        items: chefItems,
        subtotalForChef,
        payoutForChef,
      };
    })
    .filter(Boolean);
}

export async function fetchChefOrders(status) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await fetch(`${API_BASE}/api/orders/my${qs}`, { headers: { ...authHeaders() } });
  if (!res.ok) {
    // try to parse server message
    let err;
    try { err = await res.json(); } catch {}
    throw err || { message: "Failed to load orders" };
  }
  const data = await res.json();
  const serverOrders = Array.isArray(data) ? data : (data.orders || []);
  const chefId = getChefIdFromToken();
  return shapeOrdersForChef(serverOrders, chefId);
}

export async function sendOrderAction(orderId, payload) {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload), // payload as JSON object
  });
  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {}
    throw err || { message: "Failed to update order" };
  }
  return res.json();
}

