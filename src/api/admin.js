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


// UPDATE DISH by ID (multipart/form-data)
export async function updateDishAdmin(dishId, formData) {
  try {
    const res = await fetch(`${API_BASE}/api/dishes/update/${dishId}`, {
      method: "PUT",
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update dish");
    }

    return await res.json();
  } catch (err) {
    throw err;
  }
}

// DELETE DISH by ID
export async function deleteDishAdmin(dishId) {
  try {
    const res = await fetch(`${API_BASE}/api/dishes/delete/${dishId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete dish");
    }

    return await res.json();
  } catch (err) {
    throw err;
  }
}


// GET DISH by ID
export async function getDishById(dishId) {
  try {
    const res = await fetch(`${API_BASE}/api/dishes/${dishId}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch dish");
    }

    return await res.json();
  } catch (err) {
    throw err;
  }
}