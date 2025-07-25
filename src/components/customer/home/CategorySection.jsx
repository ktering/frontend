// import CategoryItem from './CategoryItem';
// import categories from '../../../assets/data/categories';
// import { Link } from 'react-router-dom';

// import { Flame, Salad, CakeSlice } from "lucide-react";
// import { GiCarrot } from "react-icons/gi";
// import { FaBowlRice } from "react-icons/fa6";
// import { MdKebabDining } from "react-icons/md"; // ✅ for Middle Eastern

// const iconsMap = {
//   trending: Flame,
//   asian: FaBowlRice,
//   "middle-eastern": MdKebabDining,
//   vegetarian: GiCarrot,
//   vegan: Salad,
//   desserts: CakeSlice,
// };

// const CategorySection = () => {
//   return (
//     <div className="w-full px-4 mb-8">

//       <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
//         {categories.map((cat) => {
//           const Icon = iconsMap[cat.id];
//           return (
//             <CategoryItem
//               key={cat.id}
//               name={cat.name}
//               image={cat.image}
//               icon={Icon}
//             />
//           );
//         })}
//       </div>

//           <div className="sm:hidden text-center mt-4">
//   <Link to="/categories">
//     <button className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-6 py-2 rounded-full transition-transform duration-200 transform hover:scale-105 active:scale-95">
//       Explore More Categories
//     </button>
//   </Link>
// </div>

//     </div>
//   );
// };

// export default CategorySection;

import { useState } from 'react';
import CategoryItem from './CategoryItem';
import categories from '../../../assets/data/categories';
import { Link } from 'react-router-dom';

import { Flame, Salad, CakeSlice } from "lucide-react";
import { GiCarrot } from "react-icons/gi";
import { FaBowlRice } from "react-icons/fa6";
import { MdKebabDining } from "react-icons/md";
import { LayoutGrid } from "lucide-react"; // For 'All'

const iconsMap = {
  all: LayoutGrid,
  trending: Flame,
  asian: FaBowlRice,
  "middle-eastern": MdKebabDining,
  vegetarian: GiCarrot,
  vegan: Salad,
  desserts: CakeSlice,
};

const CategorySection = ({ onSelectCategory, selected }) => {
  const [selectedCategory, setSelectedCategory] = useState(selected || 'all');

  const handleClick = (id) => {
    setSelectedCategory(id);
    if (onSelectCategory) onSelectCategory(id === 'all' ? null : id);
  };

  return (
    <div className="w-full px-4 mb-8">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
        {categories.map((cat) => {
          const Icon = iconsMap[cat.id];
          return (
            <CategoryItem
              key={cat.id}
              name={cat.name}
              image={cat.image}
              icon={Icon}
              isSelected={selectedCategory === cat.id}
              onClick={() => handleClick(cat.id)}
            />
          );
        })}
      </div>

      <div className="sm:hidden text-center mt-4">
        <Link to="/categories">
          <button className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-6 py-2 rounded-full transition-transform duration-200 transform hover:scale-105 active:scale-95">
            Explore More Categories
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CategorySection;
