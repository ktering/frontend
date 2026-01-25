import { Clock, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDishCard = ({ item, onEdit, onDelete, onToggleAvailability }) => {
  const navigate = useNavigate();

  const formatCategoryName = (category) => {
    return category
      ?.replace(/-/g, " ")
      ?.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div
      onClick={() => navigate(`/supervised/dishes/${item.slug}`)}
      className="bg-white rounded-xl border border-gray-200 hover:border-primary/40 hover:scale-[1.01] transition-transform duration-100 ease-in-out 
                 w-full max-w-[280px] flex flex-col cursor-pointer h-full"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3]">
        <img
          src={item.image || item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover rounded-t-xl"
        />
        <span className="absolute top-2 right-2 bg-primary text-white text-[10px] sm:text-[11px] px-2 py-[2px] rounded-full font-medium">
          {formatCategoryName(item.category)}
        </span>

        {/* 🔹 Badge if unavailable */}
        {item.available === false && (
          <span className="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] sm:text-[11px] px-2 py-[2px] rounded-full">
            Unavailable
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[40px]">
          {item.name}
        </h3>

        <div className="flex items-center gap-2 text-xs text-gray-700 mb-1">
          <ChefHat className="w-4 h-4 text-gray-700" />
          <span className="truncate">{item.chefId?.name || "Unknown Kterer"}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-700 mb-1">
          <Clock className="w-4 h-4 text-gray-700" />
          <span>{item.averagePrepTime || "N/A"}</span>
        </div>

        <p className="text-sm sm:text-base font-bold text-primary mb-3 text-left">
          ${item.originalChefPrice ? item.originalChefPrice.toFixed(2) : "0.00"}
        </p>

        {/* Buttons (stick to bottom for equal height cards) */}
        <div className="flex flex-wrap justify-center gap-2 mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/supervised/dishes/edit/${item._id}`);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 rounded-full"
          >
            Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            className="bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 rounded-full"
          >
            Delete
          </button>

          {/* 🔹 Toggle availability */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleAvailability(item);
            }}
            className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 rounded-full ${
              item.available === false
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-500 hover:bg-gray-600 text-white"
            }`}
          >
            {item.available === false ? "Mark Available" : "Mark Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDishCard;
