import { API_BASE } from "../../config";

export async function loginChef(username, password) {
  try {
    const res = await fetch(`${API_BASE}/api/chefs/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Save token here if you want automatic storage
    localStorage.setItem("token", data.token);

    return data;
  } catch (err) {
    throw err;
  }
}
