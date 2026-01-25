import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Success() {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart(); // state + localStorage cleared
  }, []);

  return (
    <div className="text-center mt-20">
      <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
      <p className="text-gray-700">Thank you for your order. We’ll start preparing your dishes shortly.</p>
      <button
        onClick={() => navigate("/menu")}
        className="bg-primary mt-10 text-white font-bold px-6 py-2 rounded-full hover:bg-white hover:border border-primary hover:text-primary transition"
      >
        Browse More Dishes
      </button>
    </div>
  );
}
