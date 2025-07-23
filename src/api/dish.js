import { API_BASE } from "../../config";

export async function getDishesByChef(chefId) {
  const res = await fetch(`${API_BASE}/api/dishes/chef/${chefId}`);
  if (!res.ok) throw new Error("Error fetching dishes");
  return res.json();
}