import FoodItemCard from "../home/FoodItemCard";

const DishList = ({ dishes, loading }) => {
  if (loading) return <p className="text-center">Loading...</p>;
  if (!dishes.length) return <p className="text-center">No dishes found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {dishes.map((dish) => (
        <FoodItemCard key={dish._id} item={dish} />
      ))}
    </div>
  );
};

export default DishList;
