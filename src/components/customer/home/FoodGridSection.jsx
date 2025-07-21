// import { useEffect, useState } from "react";
// import foodItems from "../../../assets/data/foodItems.js";
// import FoodItemCard from "./FoodItemCard";
// import { Link } from "react-router-dom";

// const FoodGridSection = ({ limit = 8, showButton = true }) => {
//   const [displayLimit, setDisplayLimit] = useState(limit);

//   useEffect(() => {
//     const handleResize = () => {
//       const isMobile = window.matchMedia("(max-width: 639px)").matches;
//       setDisplayLimit(isMobile ? 5 : limit);
//     };

//     handleResize(); // Call once on mount
//     window.addEventListener("resize", handleResize); // Update on resize

//     return () => {
//       window.removeEventListener("resize", handleResize); // Clean up
//     };
//   }, [limit]);

//   const displayedItems = foodItems.slice(0, displayLimit);

//   return (
//     <>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {displayedItems.map((item) => (
//           <FoodItemCard key={item._id} item={item} />
//         ))}
//       </div>

//       {showButton && (
//         <div className="text-center mt-8">
//           <Link to="/menu">
//             <button className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-6 py-2 rounded-full transition-transform duration-200 transform hover:scale-105 active:scale-95">
//               View Full Menu
//             </button>
//           </Link>
//         </div>
//       )}
//     </>
//   );
// };

// export default FoodGridSection;


import { useEffect, useState, useRef, useMemo } from "react";
import foodItems from "../../../assets/data/foodItems.js";
import FoodItemCard from "./FoodItemCard";
import { Link } from "react-router-dom";

const FoodGridSection = ({ limit = 8, showButton = true }) => {
  const [displayLimit, setDisplayLimit] = useState(limit);
  const lastIsMobile = useRef(null);
  const resizeTimeout = useRef();

  useEffect(() => {
    const handleResize = () => {
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(() => {
        const isMobile = window.matchMedia("(max-width: 639px)").matches;
        if (isMobile !== lastIsMobile.current) {
          setDisplayLimit(isMobile ? 5 : limit);
          lastIsMobile.current = isMobile;
        }
      }, 150); // Throttle to 150ms
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimeout.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [limit]);

  const displayedItems = useMemo(() => {
    return foodItems.slice(0, displayLimit);
  }, [displayLimit]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[400px]">
        {displayedItems.map((item) => (
          <FoodItemCard key={item._id} item={item} />
        ))}
      </div>
      {showButton && (
        <div className="text-center mt-8">
          <Link to="/menu">
            <button className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-6 py-2 rounded-full transition-transform duration-200 transform hover:scale-105 active:scale-95">
              View Full Menu
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

export default FoodGridSection;
