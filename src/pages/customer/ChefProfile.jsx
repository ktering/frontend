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
    <div className="">
      <Header />
        {/* Chef Info */}
        {/* Profile Banner + Avatar + Name */}
<section className="w-3/4 mx-auto my-6">
  {/* Banner */}
  <div className="w-full h-36 md:h-48 overflow-hidden rounded-t-xl bg-gray-200">
    <img
      src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
      alt="Banner"
      className="w-full h-full object-cover"
    />
  </div>
  <div className="flex p-10 gap-1 items-center  ">
    <img
      src={chef.profileImageUrl || "/default-chef.jpg"}
      alt={chef.name}
      className="w-24 h-24 rounded-lg object-cover bg-white"
    />
    <div className="pl-8">
        <p className="text-2xl font-semibold text-gray-900">{chef.name}</p>
        
      <div className="text-gray-500 text-base mt-1">Home Chef</div>
      {chef.bio && <p className="text-gray-700 mt-2 max-w-md">{chef.bio}</p>}
    </div>
    
  </div>
        {/* Dishes */}
        <section className="p-10">
          <h2 className="text-xl font-semibold mb-5">Dishes by {chef.name}</h2>
          {dishes.length === 0 ? (
            <div className="text-gray-500">No dishes yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
        </section>  */}
</section>

      <Footer />
    </div>
  );
}
