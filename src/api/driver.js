// src/api/driver.js
import { API_BASE } from "../../config";

function authHeaders() {
  const t = localStorage.getItem("authToken");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function fetchDriverOrders(status = "delivered") {
  const res = await fetch(`${API_BASE}/api/driver/orders?status=${encodeURIComponent(status)}`, {
    headers: { ...authHeaders() }
  });
  if (!res.ok) {
    let err; try { err = await res.json(); } catch {}
    throw err || { message: "Failed to load driver orders" };
  }
  const data = await res.json();
  return data?.orders || [];
}

export const uploadDeliveryPhoto = async (formData) => {
  const response = await fetch(`${API_BASE}/api/driver/upload-photo`, {
    method: "POST",
    body: formData, // FormData with Blob
  });

  return response.json();
};