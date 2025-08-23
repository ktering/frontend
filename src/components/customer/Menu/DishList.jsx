import FoodItemCard from "../home/FoodItemCard";
import { Loader2, Utensils } from "lucide-react";

const DishList = ({ dishes, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="animate-spin w-6 h-6 text-primary" />
        <span className="ml-2 text-primary font-medium">Loading menu...</span>
      </div>
    );
  }

  if (!dishes.length) {
    return (
      <div className="text-center min-h-[300px] flex flex-col items-center justify-center text-gray-600">
        <Utensils className="w-12 h-12 text-primary mb-3" />
        <p className="text-lg font-semibold">We’re cooking something fresh!</p>
        <p className="text-sm mt-1">Our Kterers are adding delicious dishes soon. Stay tuned!</p>
      </div>
    );
  }

  return (
    <div className="w-4/5 mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {dishes
  .map((dish) => (
    <FoodItemCard key={dish._id} item={dish} />
  ))}
      </div>
    </div>
  );
};

export default DishList;
