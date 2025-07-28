import { API_BASE } from "../../config";

export async function getChefById(id) {
  const res = await fetch(`${API_BASE}/api/chefs/${id}`);
  if (!res.ok) throw new Error("Chef not found");
  return res.json();
}
export async function getAllChefs() {
  const res = await fetch(`${API_BASE}/api/chefs`);
  if (!res.ok) throw new Error("Failed to fetch chefs");
  return res.json();
}

export async function createChef(formData) {
  const res = await fetch(`${API_BASE}/api/chefs`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to create chef");
  return res.json();
}

export async function updateChef(id, formData) {
  const res = await fetch(`${API_BASE}/api/chefs/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to update chef");
  return res.json();
}

export async function deleteChef(id) {
  const res = await fetch(`${API_BASE}/api/chefs/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete chef");
  return res.json();
}