import React from "react";
import { useCart } from "../../context/CartContext";
import Header from "../../components/customer/Header";
import OrderSummary from "../../components/customer/checkout/OrderSummary";
import CustomerForm from "../../components/customer/checkout/GuestCheckoutForm";

export default function CheckoutPage() {
  const { cart } = useCart();

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8 font-nunito">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
          Checkout
        </h1>
        {cart.length === 0 ? (
          <p className="text-gray-600 text-center">Your cart is empty.</p>
        ) : (
          <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            {/* Left side - Customer Info */}
            <div>
              <CustomerForm />
            </div>

            {/* Right side - Order Summary */}
            <div>
              <OrderSummary />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
