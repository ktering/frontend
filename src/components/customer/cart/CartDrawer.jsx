import React from "react";
import { useCart } from "../../../context/CartContext";
import { X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-nunito">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-primary">Your Cart</h2>
          <button onClick={onClose} aria-label="Close">
            <X className="text-gray-700 hover:text-primary transition" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.length === 0 ? (
            <p className="text-sm text-gray-600">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 border-b pb-4 items-center cursor-pointer"
                onClick={() => {
                  onClose();
                  navigate(`/dish/${item.slug}`);
                }}
              >
                {/* Image */}
                <img
                  src={item.image || item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 rounded object-cover"
                />

                {/* Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm text-gray-800">
                      {item.name}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item._id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-[2px]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item._id, Math.max(1, item.quantity - 1));
                      }}
                      disabled={item.quantity === 1}
                      className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 hover:bg-primary hover:text-white disabled:opacity-50 transition text-xs font-bold"
                    >
                      −
                    </button>
                    <span className="min-w-[24px] text-center text-xs font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item._id, item.quantity + 1);
                      }}
                      className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 hover:bg-primary hover:text-white transition text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-5 py-4">
          <div className="flex justify-between font-semibold text-sm mb-4">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose();
                navigate("/menu");
              }}
              className="w-full border border-primary text-primary font-semibold text-sm py-2 rounded-full hover:bg-primary hover:text-white transition"
            >
              Continue Shopping
            </button>

            <button
              onClick={() => {
                onClose();
                navigate("/cart");
              }}
              className="w-full bg-primary text-white font-semibold text-sm py-2 rounded-full hover:bg-primary/90 transition"
            >
              View Full Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
