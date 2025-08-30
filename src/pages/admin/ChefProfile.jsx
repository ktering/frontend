import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom"; // for /chefs/:chefId route
import { getChefById } from "../../api/chef"; // adjust the import path as needed
import { getDishesByChef } from "../../api/dish";
import ChefDishCard from "../../components/chef/ChefDishCard";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
export default function ChefProfile() {
  const { chefId } = useParams();
  const [chef, setChef] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate= useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([getChefById(chefId), getDishesByChef(chefId)])
      .then(([chefData, dishData]) => {
        setChef(chefData);
        setDishes(dishData);
      })
      .finally(() => setLoading(false));
  }, [chefId]);

  if (loading) return <div className="py-24 text-center text-gray-500">Loading...</div>;
  if (!chef) return <div className="py-24 text-center text-red-500">Kterer not found.</div>;

  return (
    <AdminLayout>
      {/* Back to Dashboard Button */}
      <button
        onClick={() => navigate("/supervised/chefs")}
        className="flex items-center gap-2 mt-6 ml-6 mb-6 text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Chefs
      </button>
<section className="max-w-5xl mx-auto my-8 bg-white rounded-xl shadow-sm overflow-hidden">
  {/* Banner */}
  <div className="relative w-full h-48 md:h-60">
    <img
      src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
      alt="Banner"
      className="w-full h-full object-cover"
    />
    <div className="absolute left-10 -bottom-16 flex items-center">
      <img
        src={chef.photoUrl}
        alt={chef.name}
        className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md object-cover bg-gray-100"
      />
    </div>
  </div>

  {/* Chef Info */}
  <div className="mt-20 md:mt-20 px-6 md:px-10 flex flex-col md:flex-row md:items-center md:gap-8">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{chef.name}</h1>
      <p className="text-gray-500 text-base mt-1">Home Kterer</p>
      {chef.bio && <p className="text-gray-700 mt-3 max-w-xl">{chef.bio}</p>}
    </div>
  </div>

  {/* Dishes */}
  <section className="px-6 md:px-10 py-10">
    <h2 className="text-2xl font-semibold mb-5">Dishes by {chef.name}</h2>
    {dishes.length === 0 ? (
      <div className="text-gray-500">No dishes yet.</div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dishes.map((dish) => (
          <ChefDishCard
            key={dish._id}
            item={dish}
            />
        ))}
      </div>
    )}
  </section>
</section>
    </AdminLayout>
  );
}
