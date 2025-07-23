import { API_BASE } from "../../config";

export async function getChefById(id) {
  const res = await fetch(`${API_BASE}/api/chefs/${id}`);
  if (!res.ok) throw new Error("Chef not found");
  return res.json();
}
