import { useState } from "react";
import { Link } from "react-router-dom";
import CategoryItem from "./CategoryItem";
import categories from "../../../assets/data/categories";

// Icons
import { Flame, Salad, CakeSlice, LayoutGrid } from "lucide-react";
import { GiCarrot } from "react-icons/gi";
import { FaBowlRice } from "react-icons/fa6";
import { MdKebabDining } from "react-icons/md";

// Map icons to category IDs
const iconsMap = {
  all: LayoutGrid,
  trending: Flame,
  asian: FaBowlRice,
  "middle-eastern": MdKebabDining,
  vegetarian: GiCarrot,
  vegan: Salad,
  desserts: CakeSlice,
};

const CategorySection = ({ selected }) => {
  const [selectedCategory, setSelectedCategory] = useState(selected || "all");

  return (
    <div className="w-full px-4 mb-8">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
        {categories.map((cat) => {
          const Icon = iconsMap[cat.id] || LayoutGrid;
          return (
            <Link
              to={`/menu?category=${cat.id}`}
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <CategoryItem
                name={cat.name}
                image={cat.image}
                icon={Icon}
                isSelected={selectedCategory === cat.id}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySection;
