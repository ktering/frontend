// // export default FoodGridSection;
// import { useMemo } from "react";
// import foodItems from "../../../assets/data/foodItems.js";
// import FoodItemCard from "./FoodItemCard";
// import { Link } from "react-router-dom";

// const FoodGridSection = ({ limit = 8, showButton = true }) => {
//   const displayedItems = useMemo(() => {
//     return foodItems.slice(0, limit);
//   }, [limit]);

//   return (
//     <>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[400px]">
//         {displayedItems.map((item) => (
//           <FoodItemCard key={item._id} item={item} />
//         ))}
//       </div>

//       {showButton && (
//         <div className="text-center mt-8">
//           <Link to="/menu">
//             <button className="bg-primary text-white text-sm font-medium px-6 py-2 rounded-full transition-colors duration-200 border border-primary hover:bg-white hover:text-primary">
//               View Full Menu
//             </button>
//           </Link>
//         </div>
//       )}

//     </>
//   );
// };

// export default FoodGridSection;

// FoodGridSection.jsx
import { useEffect, useState } from "react";
import { fetchAllDishes } from "../../../api/dish"; // same as Menu page
import FoodItemCard from "./FoodItemCard";
import { Link } from "react-router-dom";

const FoodGridSection = ({ limit = 8, showButton = true }) => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDishes = async () => {
      setLoading(true);
      try {
        const data = await fetchAllDishes();
        setDishes(data.slice(0, limit)); // limit to given number
      } catch (error) {
        console.error("Error fetching dishes:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDishes();
  }, [limit]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dishes.map((item) => (
          <FoodItemCard key={item._id} item={item} />
        ))}
      </div>

      {showButton && dishes.length > 0 && (
        <div className="text-center mt-8">
          <Link to="/menu">
            <button className="bg-primary text-white text-sm font-medium px-6 py-2 rounded-full transition-colors duration-200 border border-primary hover:bg-white hover:text-primary">
              View Full Menu
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

export default FoodGridSection;
