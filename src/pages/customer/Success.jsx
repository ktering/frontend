import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext"; // import your CartContext

export default function Success() {
  const navigate = useNavigate();
  const { clearCart } = useCart(); // get the clearCart function

  useEffect(() => {
    // Clear the cart as soon as this page loads
    clearCart();
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center font-nunito">
      <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
      <p className="text-gray-700">
        Thank you for your order. We’ll start preparing your dishes shortly.
      </p>
      <button
        onClick={() => navigate("/menu")}
        className="bg-primary mt-10 text-white font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full shadow hover:bg-white hover:border border-primary hover:text-primary transition-colors text-base sm:text-lg mx-auto"
      >
        Browse More Dishes
      </button>
    </div>
  );
}
