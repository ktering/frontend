// src/api/admin.js
import { API_BASE } from "../../config";

// CREATE DISH API using fetch (multipart/form-data)
export async function createDishAdmin(formData) {
  try {
    const res = await fetch(`${API_BASE}/api/dishes`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create dish");
    }

    return await res.json();
  } catch (err) {
    throw err;
  }
}
