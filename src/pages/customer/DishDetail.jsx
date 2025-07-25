import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchDishBySlug } from "../../api/dish"; // adjust the path as needed

const DishDetail = () => {
  const { slug } = useParams();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDish = async () => {
      const data = await fetchDishBySlug(slug);
      setDish(data);
      setLoading(false);
    };

    loadDish();
  }, [slug]);

  if (loading) return <p className="text-center mt-10">Loading dish...</p>;
  if (!dish) return <p className="text-center mt-10">Dish not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 font-nunito">
      <img
        src={dish.image}
        alt={dish.name}
        className="w-full h-72 object-cover rounded-xl mb-6"
      />
      <h1 className="text-3xl font-bold text-primary mb-2">{dish.name}</h1>
      <p className="text-gray-700 mb-4">{dish.description}</p>
      <p className="text-lg font-semibold text-primary">${dish.price.toFixed(2)}</p>
      {/* You can add ingredients, chef, tags etc here */}
    </div>
  );
};

export default DishDetail;
