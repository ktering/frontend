import { useCart } from "../../context/CartContext";
import Header from "../../components/customer/Header";
import OrderSummary from "../../components/customer/checkout/OrderSummary";
import GuestCheckoutForm from "../../components/customer/checkout/GuestCheckoutForm";
import { createCheckoutSession } from "../../api/stripe";
import React, { useMemo, useState } from "react";

export default function CheckoutPage() {
  const { cart, note } = useCart();
  const [busy, setBusy] = useState(false);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const deliveryFee = 5; 
  const platformFee = 2.9; 
  const total = subtotal + deliveryFee+platformFee;

  const handleProceed = async (validatedCustomer) => {
    if (!cart.length) return;
    try {
      setBusy(true);
      const { url } = await createCheckoutSession({
        cartItems: cart,
        customer: validatedCustomer,
        note,
      });
      if (!url) throw new Error("No redirect URL from server");
      window.location.href = url; // go to Stripe
    } catch (e) {
      alert(e?.message || "Could not start checkout. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8 font-nunito">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6">Checkout</h1>

        {cart.length === 0 ? (
          <p className="text-gray-600 text-center">Your cart is empty.</p>
        ) : (
          <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            <div className="space-y-6">
              <GuestCheckoutForm
                onProceed={handleProceed}
                disabled={busy}
                payLabel={`Proceed to Pay $${total.toFixed(2)}`}
              />
            </div>
            <div>
              <OrderSummary />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
