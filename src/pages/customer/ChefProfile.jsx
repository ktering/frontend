import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // for /chefs/:chefId route
import { getChefById } from "../../api/chef"; // adjust the import path as needed
import { getDishesByChef } from "../../api/dish";
import FoodItemCard from "../../components/customer/home/FoodItemCard"; // adjust the import path as needed
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";

export default function ChefProfile() {
  const { chefId } = useParams();
  const [chef, setChef] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

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
  if (!chef) return <div className="py-24 text-center text-red-500">Chef not found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Chef Info */}
        <section className="bg-white rounded-xl shadow p-6 mb-10">
          <div className="flex flex-col gap-1 mb-2">
            <h1 className="text-2xl font-bold">{chef.name}</h1>
            <span className="text-green-600 text-sm font-medium">Home Chef</span>
          </div>
          {chef.bio && <p className="text-gray-700 mb-3">{chef.bio}</p>}
          {/* Example rating */}
          <div className="flex items-center gap-2 mb-1">
            {/* Show 4.5 stars, hardcoded for now, replace with chef.rating if you have */}
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < 4 ? "" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.181c.969 0 1.371 1.24.588 1.81l-3.386 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.538 1.118l-3.386-2.46a1 1 0 00-1.175 0l-3.386 2.46c-.783.57-1.838-.197-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.181a1 1 0 00.95-.69l1.286-3.966z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600 text-sm">4.5 (23 reviews)</span>
          </div>
          {/* Add more chef info if needed, e.g. kitchenLocation, specialties, etc. */}
        </section>

        {/* Dishes */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-5">Dishes by {chef.name}</h2>
          {dishes.length === 0 ? (
            <div className="text-gray-500">No dishes yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {dishes.map((dish) => (
                <FoodItemCard
                  key={dish._id}
                  item={{
                    ...dish,
                    chef: undefined, // hide chef name on this page
                    prepTime: dish.averagePrepTime ? `${dish.averagePrepTime} min` : "",
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Reviews - placeholder, since your backend doesn't have reviews yet */}
        {/* <section>
          <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
          <div className="space-y-4">
            <div className="text-gray-500">No reviews yet.</div>
          </div>
        </section> */}
      </main>
      <Footer />
    </div>
  );
}
