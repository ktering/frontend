// components/admin/AdminDishCard.jsx
import { Clock, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDishCard = ({ item, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const formatCategoryName = (category) => {
    return category
      .replace(/-/g, ' ')          // replace dashes with spaces
      .replace(/\b\w/g, c => c.toUpperCase()); // capitalize first letter of each word
  };


  return (
    <div
      onClick={() => navigate(`/dish/${item.slug}`)}
      className="bg-white rounded-xl border border-gray-200 hover:border-primary/40 hover:scale-[1.01] transition-transform duration-100 ease-in-out w-full max-w-[270px] mx-auto flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative w-full h-36">
        <img
          src={item.image || item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover rounded-t-xl"
        />
        <span className="absolute top-2 right-2 bg-primary text-white text-[11px] px-2 py-[2px] rounded-full font-medium">
          {formatCategoryName(item.category)}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Dish Name */}
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          {item.name}
        </h3>

        {/* Chef */}
        <div className="flex items-center gap-2 text-xs text-gray-700 mb-1">
          <ChefHat className="w-4 h-4 text-gray-700" />
          <span>{item.chefId?.name || "Unknown Chef"}</span>
        </div>

        {/* Prep Time */}
        <div className="flex items-center gap-2 text-xs text-gray-700 mb-1">
          <Clock className="w-4 h-4 text-gray-700" />
          <span>{item.averagePrepTime || "N/A"}</span>
        </div>

        {/* Price */}
        <p className="text-sm font-bold text-primary mb-3 text-left">
          ${item.originalChefPrice ? item.originalChefPrice.toFixed(2) : "0.00"}
        </p>

        {/* Buttons Centered */}
        <div className="flex justify-center gap-2 mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/supervised/dishes/edit/${item._id}`);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-4 py-1 rounded-full"
          >
            Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-4 py-1 rounded-full"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDishCard;
