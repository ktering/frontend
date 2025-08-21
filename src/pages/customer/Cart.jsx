import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/customer/Header";
import { Trash2 } from "lucide-react";

export default function Cart() {
    const { cart, note, setNote, updateQuantity, removeFromCart } = useCart();

    const navigate = useNavigate();

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    useEffect(() => {
  const stored = localStorage.getItem("kterings_cart_full");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      console.log("🛒 Full Cart Object from localStorage:", parsed);
      console.log("🛒 Cart Items:", parsed.cart);
      console.log("📝 Note:", parsed.note);
    } catch (err) {
      console.error("Failed to parse localStorage:", err);
    }
  } else {
    console.log("ℹ️ No cart data in localStorage");
  }
}, []);

    return (
        <>
            <Header />
            <div className="max-w-5xl mx-auto px-4 py-8 font-nunito">
                <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
                    Your Cart
                </h1>

                {cart.length === 0 ? (
                    <div className="text-center text-gray-600 mt-10">
                        <p>Your cart is empty.</p>
                        <Link
                            to="/menu"
                            className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition"
                        >
                            Explore Menu
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Table Headers (Desktop only) */}
                        <div className="hidden sm:grid grid-cols-[1fr_140px_140px_140px] gap-4 text-sm font-semibold text-gray-500 border-b pb-2 mb-4">
                            <span>Product</span>
                            <span className="text-center">Price</span>
                            <span className="text-center">Quantity</span>
                            <span className="text-center">Total</span>
                        </div>

                        {/* Items */}
                        <div className="space-y-6 mb-8">
                            {cart.map((item) => (
                                <div
                                    key={item._id}
                                    className="grid sm:grid-cols-[1fr_140px_140px_140px] gap-4 items-center border-b pb-4"
                                >
                                    {/* Mobile Version (stacked layout) */}
                                    <div className="flex sm:hidden gap-4">
                                        <img
                                            src={item.image || item.imageUrl}
                                            alt={item.name}
                                            className="w-16 h-16 rounded object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-semibold text-sm text-gray-800">
                                                    {item.name}
                                                </h3>
                                                <button
                                                    onClick={() => removeFromCart(item._id)}
                                                    className="text-gray-400 hover:text-red-500 transition"
                                                    title="Remove item"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-[2px]">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item._id, Math.max(1, item.quantity - 1))
                                                    }
                                                    disabled={item.quantity === 1}
                                                    className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 hover:bg-primary hover:text-white disabled:opacity-50 transition text-xs font-bold"
                                                >
                                                    −
                                                </button>
                                                <span className="min-w-[24px] text-center text-xs font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 hover:bg-primary hover:text-white transition text-xs font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Desktop version */}
                                    <div
                                        className="hidden sm:flex items-center gap-4 cursor-pointer"
                                        onClick={() => navigate(`/dish/${item.slug}`)}
                                    >
                                        <img
                                            src={item.image || item.imageUrl}
                                            alt={item.name}
                                            className="w-20 h-20 rounded object-cover"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {item.name}
                                            </p>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFromCart(item._id);
                                                }}
                                                className="mt-1 text-gray-400 hover:text-red-500 transition"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="hidden sm:flex justify-center text-gray-800">
                                        ${item.price.toFixed(2)}
                                    </div>

                                    {/* Quantity */}
                                    <div className="hidden sm:flex justify-center gap-2 items-center">
                                        <button
                                            onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                                            disabled={item.quantity === 1}
                                            className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-primary hover:text-white disabled:opacity-50 transition text-sm font-bold"
                                        >
                                            −
                                        </button>
                                        <span className="min-w-[28px] text-center text-sm font-medium">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-primary hover:text-white transition text-sm font-bold"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Total */}
                                    <div className="hidden sm:flex justify-center font-semibold text-gray-800">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Note */}
                        <div className="mb-6">
                            <label
                                htmlFor="note"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Note to Kterer:
                            </label>
                            <textarea
                                id="note"
                                rows={3}
                                placeholder="Leave a message for the Kterer (optional)"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                            ></textarea>
                        </div>

                        {/* Summary */}
                        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Subtotal */}
                            <div className="text-lg font-semibold text-gray-800 text-center sm:text-left">
                                Subtotal: <span className="text-primary">${subtotal.toFixed(2)}</span>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <Link
                                    to="/menu"
                                    className="w-full sm:w-auto border border-primary text-primary px-5 py-2 rounded-full hover:bg-primary hover:text-white transition text-sm font-medium text-center"
                                >
                                    Continue Shopping
                                </Link>
                                <button
                                    onClick={() => navigate("/checkout")}
                                    className="w-full sm:w-auto bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition text-sm text-center"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>

                    </>
                )}
            </div>
        </>
    );
}
