import { API_BASE } from "../../config";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function fetchAdminOrders(status) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await fetch(`${API_BASE}/api/orders/admin${qs}`, {
    headers: { ...authHeaders() }
  });

  if (!res.ok) {
    let err; try { err = await res.json(); } catch {}
    throw err || { message: "Failed to load admin orders" };
  }

  const data = await res.json();
  return Array.isArray(data.orders) ? data.orders : (data.orders || []);
}
export async function sendAdminOrderAction(orderId, payload) {
  const res = await fetch(`${API_BASE}/api/orders/admin/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let err; try { err = await res.json(); } catch {}
    throw err || { message: "Failed to update order" };
  }
  return res.json();
}
