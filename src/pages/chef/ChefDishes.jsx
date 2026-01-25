import { useEffect, useMemo, useState } from "react";
import ChefLayout from "../../components/chef/chefLayout";
import ChefDishCard from "../../components/chef/ChefDishCard";
import { getDishesByChef } from "../../api/dish"; 

// base64url-safe token decode to get chefId
function getChefIdFromToken() {
  const t = localStorage.getItem("token");
  if (!t) return null;
  try {
    const base64 = t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64))?.userId || null;
  } catch { return null; }
}

export default function ChefDishes() {
  const chefId = useMemo(() => getChefIdFromToken(), []);
  const chefName = localStorage.getItem("chefName") || "Kterer";

  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!chefId) { setErr("Not logged in"); setLoading(false); return; }
      setLoading(true); setErr("");
      try {
        const list = await getDishesByChef(chefId);
        if (alive) setDishes(Array.isArray(list) ? list : []);
      } catch (e) {
        if (alive) { setErr(e?.message || "Failed to load dishes"); setDishes([]); }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [chefId]);

  const filtered = useMemo(() => {
    if (!query.trim()) return dishes;
    const q = query.toLowerCase();
    return dishes.filter(d =>
      d.name?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q)
    );
  }, [dishes, query]);

  return (
    <ChefLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dishes</h1>
          <p className="text-sm text-gray-600">Viewing dishes for {chefName}</p>
        </div>
        {/* No Add button — read-only */}
      </div>

      

      {loading ? (
        <p className="text-gray-500">Loading dishes…</p>
      ) : err ? (
        <p className="text-red-600">{err}</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          <p className="text-base font-medium">No dishes found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((dish) => (
            <ChefDishCard key={dish._id} item={dish} />
          ))}
        </div>
      )}
    </ChefLayout>
  );
}
