import { Clock, ChefHat, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useState } from "react";
import CartDrawer from "../../customer/cart/CartDrawer";

const FoodItemCard = ({ item }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isSoldOut = item?.available === false;

  const formatCategoryName = (category) => {
    return category
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevents navigating to dish page
    if (isSoldOut) return; // No-op if sold out
    addToCart(item);
    setIsCartOpen(true);
  };

  return (
    <>
      <div
        onClick={() => !isSoldOut && navigate(`/dish/${item.slug}`)}
        className={`bg-white rounded-xl border [border-color:#e0dada] 
          hover:border-primary/40 hover:scale-[1.01] transition-transform 
          duration-50 ease-in-out w-full max-w-[270px] mx-auto flex flex-col 
          ${!isSoldOut && "cursor-pointer"}`}
      >
        {/* Image */}
        <div className="relative w-full h-36">
          <img
            src={item.image || item.imageUrl}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover rounded-t-xl"
          />
          <span className="absolute top-2 right-2 bg-primary text-white text-[11px] px-2 py-[2px] rounded-full font-medium">
            {formatCategoryName(item.category)}
          </span>

          {isSoldOut && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-xl">
              <span className="text-white text-sm font-semibold bg-black/70 px-3 py-1 rounded-full">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            {item.name}
          </h3>

          <div className="flex items-center gap-2 text-xs text-gray-700 mb-1">
            <ChefHat className="w-4 h-4 text-gray-800" />
            <span>{item.chefId?.name || "Unknown Chef"}</span>
          </div>

          {item?.averagePrepTime && (
            <div className="flex items-center gap-2 text-xs text-gray-700 mb-4">
              <Clock className="w-4 h-4 text-gray-800" />
              <span>{item.averagePrepTime} min</span>
            </div>
          )}

          {/* Price + Button */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <p className="text-sm font-bold text-primary">
              ${item.price ? item.price.toFixed(2) : "0.00"}
            </p>

            {!isSoldOut ? (
              <button
                onClick={handleAddToCart}
                className="relative min-w-[100px] h-8 px-4 py-[6px] rounded-full bg-primary text-white text-xs font-medium flex items-center justify-center transition-colors duration-150 group overflow-hidden"
              >
                <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-100 group-hover:opacity-0">
                  Add to Cart
                </span>
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </span>
              </button>
            ) : (
              <button
                disabled
                onClick={(e) => e.stopPropagation()}
                className="min-w-[100px] h-8 px-4 py-[6px] rounded-full bg-gray-300 text-gray-700 text-xs font-medium cursor-not-allowed"
              >
                Add To Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default FoodItemCard;
