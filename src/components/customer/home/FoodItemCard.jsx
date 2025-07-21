import { Clock, ChefHat, ShoppingBag } from "lucide-react";



const FoodItemCard = ({ item }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden w-full max-w-[270px] mx-auto flex flex-col border border-gray-100">
      {/* Image with Category Tag */}
      <div className="relative w-full h-36">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 right-2 bg-primary text-white text-[11px] px-2 py-[2px] rounded-full font-medium">
          {item.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          {item.name}
        </h3>

        <div className="flex items-center gap-2 text-xs text-gray-700 mb-1">
          <ChefHat className="w-4 h-4 text-gray-800" />
          <span>{item.chef}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-700 mb-4">
          <Clock className="w-4 h-4 text-gray-800" />
          <span>{item.prepTime}</span>
        </div>

        {/* Price + Button */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <p className="text-sm font-bold text-primary">
            ${item.price.toFixed(2)}
          </p>
         <button className="bg-primary hover:bg-primary/90 text-white text-xs px-4 py-[6px] rounded-full font-medium flex items-center justify-center gap-1 transition-all duration-300 group relative overflow-hidden min-w-[100px] h-8">
  {/* Text shown normally */}
  <span className="transition-all duration-200 ease-in-out group-hover:opacity-0">
    Add to Cart
  </span>

  {/* Icon appears on hover */}
 <ShoppingBag
  className="absolute opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out w-4 h-4"
/>

</button>

        </div>
      </div>
    </div>
  );
};

export default FoodItemCard;
