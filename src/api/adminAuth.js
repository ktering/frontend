import { API_BASE } from "../../config";

export async function loginUser({ username, password, role }) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }
  return res.json();
}

export function getToken() {
  return localStorage.getItem("authToken");
}

export function logoutUser() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("role");
  localStorage.removeItem("driverName");
}

export function isLoggedIn() {
  return !!localStorage.getItem("authToken");
}
