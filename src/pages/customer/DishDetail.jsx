import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchDishBySlug } from "../../api/dish";
import { ChefHat, Drumstick, Minus, Plus } from "lucide-react";
import { GiPeanut } from "react-icons/gi";
import Header from "../../components/customer/Header";
import { useCart } from "../../context/CartContext";
import CartDrawer from "../../components/customer/cart/CartDrawer";

const DishDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [dish, setDish] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleAddToCart = (e) => {
        e.stopPropagation();

        addToCart({ ...dish, quantity }); // Corrected: use dish, not item
        setIsCartOpen(true);

        // Auto-close drawer after 1.5s
        // setTimeout(() => setIsCartOpen(false), 1500);
    };

    useEffect(() => {
        const loadDish = async () => {
            const data = await fetchDishBySlug(slug);
            setDish(data);
            setLoading(false);
        };
        loadDish();
    }, [slug]);

    const handleQuantityChange = (val) => {
        if (val >= 1) setQuantity(val);
    };

    if (loading) return <p className="text-center mt-10">Loading dish...</p>;
    if (!dish) return <p className="text-center mt-10">Dish not found.</p>;

    const isChickenDish = dish.ingredients?.some((ing) =>
        ing.toLowerCase().includes("chicken")
    );

    const dietaryLabel = dish.halal
        ? "Halal"
        : dish.kosher
            ? "Kosher"
            : dish.vegetarian
                ? "Vegetarian"
                : null;

    const subtotal = dish.price ? (dish.price * quantity).toFixed(2) : "0.00";

    return (
        <>
            <Header />
            <div className="max-w-6xl mx-auto px-4 py-10 font-nunito">
                {/* Image Section */}
                <div className="w-full mb-6 md:hidden">
                    <div className="w-full h-[250px] sm:h-[300px] rounded-xl overflow-hidden shadow-md">
                        <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Layout: Flex for desktop */}
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Left Image for Desktop */}
                    <div className="hidden md:flex md:w-[40%] justify-center">
                        <div className="w-full max-w-sm aspect-[4/3] rounded-xl overflow-hidden shadow-md">
                            <img
                                src={dish.image}
                                alt={dish.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4 pr-2 md:pr-6">
                        <h1 className="text-3xl font-bold text-primary">{dish.name}</h1>

                        <div className="flex items-center gap-2 text-sm">
                            <span className="bg-gray-100 px-3 py-[2px] rounded-full text-gray-800 border">
                                {dish.category}
                            </span>
                            {dietaryLabel && (
                                <span className="bg-green-100 px-3 py-[2px] rounded-full text-green-800 border border-green-300">
                                    {dietaryLabel}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {dish.description && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                                    Description:
                                </h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {dish.description}
                                </p>
                            </div>
                        )}

                        {/* Chef */}
                        {dish.chefId && (
                            <div
                                className="flex items-center gap-2 mt-2 text-sm cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (dish.chefId?._id) {
                                        navigate(`/chefs/${dish.chefId._id}`);
                                    }
                                }}
                            >
                                <div className="bg-gray-200 p-2 rounded-full">
                                    <ChefHat className="w-5 h-5 text-gray-800" />
                                </div>
                                <span className="text-gray-800 font-medium hover:underline">
                                    {dish.chefId?.name || "Unknown Kterer"}
                                </span>
                            </div>
                        )}

                        {/* Ingredients */}
                        {dish.ingredients?.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                                    Ingredients:
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {dish.ingredients.map((ing, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 rounded-full bg-gray-100 text-xs border"
                                        >
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Metadata Labels */}
                        {(isChickenDish && dish.meatType) || dish.containsNuts || dish.ethnicType ? (
                            <div className="flex items-center gap-4 mt-4 flex-wrap text-sm text-gray-700">
                                {isChickenDish && dish.meatType && (
                                    <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full border border-orange-200 text-orange-800">
                                        <Drumstick className="w-4 h-4" />
                                        {dish.meatType}
                                    </div>
                                )}
                                {dish.containsNuts && (
                                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200 text-yellow-800">
                                        <GiPeanut className="w-4 h-4" />
                                        Contains Nuts
                                    </div>
                                )}
                                {dish.ethnicType && (
                                    <div className="bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-1 rounded-full text-sm">
                                        Cuisine: {dish.ethnicType}
                                    </div>
                                )}
                            </div>
                        ) : null}

                        <hr className="border-t border-gray-200 my-4" />

                        {/* Subtotal */}
                        <div className="flex justify-between items-center text-sm font-medium text-gray-800 mb-2">
                            <span>Subtotal:</span>
                            <span className="text-primary font-bold">${subtotal}</span>
                        </div>

                        {/* Quantity + Cart */}
                        <div className="flex items-center gap-3 w-full">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-red-100 active:bg-red-200 transition-colors duration-150 flex items-center justify-center font-bold text-lg text-primary"
                                >
                                    <Minus size={16} />
                                </button>

                                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-medium text-sm">
                                    {quantity}
                                </div>

                                <button
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-red-100 active:bg-red-200 transition-colors duration-150 flex items-center justify-center font-bold text-lg text-primary"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-full transition duration-200 hover:bg-primary/90 flex items-center justify-center gap-2"
                            >
                                Add to Cart →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Temporary Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};

export default DishDetail;
