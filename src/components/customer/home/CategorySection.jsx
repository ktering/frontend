import CategoryItem from './CategoryItem';
import categories from '../../../assets/data/categories';

import { Flame, Salad, CakeSlice } from "lucide-react";
import { GiCarrot } from "react-icons/gi";
import { FaBowlRice } from "react-icons/fa6";
import { MdKebabDining } from "react-icons/md"; // ✅ for Middle Eastern

const iconsMap = {
  trending: Flame,
  asian: FaBowlRice,
  "middle-eastern": MdKebabDining,
  vegetarian: GiCarrot,
  vegan: Salad,
  desserts: CakeSlice,
};

const CategorySection = () => {
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
            />
          );
        })}
      </div>
    </div>
  );
};

export default CategorySection;






