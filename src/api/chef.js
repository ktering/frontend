import { API_BASE } from "../../config";

export async function getChefById(id) {
  const res = await fetch(`${API_BASE}/api/chefs/${id}`);
  if (!res.ok) throw new Error("Kterer not found");
  return res.json();
}
export async function getAllChefs() {
  const res = await fetch(`${API_BASE}/api/chefs`);
  if (!res.ok) throw new Error("Failed to fetch Kterers");
  return res.json();
}

export async function createChef(formData) {
  const res = await fetch(`${API_BASE}/api/chefs`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();   // read body once
  if (!res.ok) {
    throw new Error(data.message || "Failed to create Kterer");
  }
  return data;
}

export async function updateChef(id, formData) {
  const res = await fetch(`${API_BASE}/api/chefs/${id}`, {
    method: "PUT",
    body: formData,
  });
  const data = await res.json();   // read body once
  if (!res.ok) {
    throw new Error(data.message || "Failed to update Kterer");
  }
  return data;
}

export async function deleteChef(id) {
  const res = await fetch(`${API_BASE}/api/chefs/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete Kterer");
  return res.json();
}