/* import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "../../../context/CartContext"; */

export default function PaymentForm() {
  /* const stripe = useStripe();
  const elements = useElements();
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Calculate total amount from cart (You can include delivery fees etc.)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 3.5; // Example static delivery fee
  const total = (subtotal + deliveryFee).toFixed(2);

  const handlePayment = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Here you would call your backend to create a PaymentIntent
      // const res = await fetch("/api/create-payment-intent", { ... });
      // const { client_secret } = await res.json();

      // For now, just simulate success
      console.log("💳 Simulating payment with total: $", total);

      // Uncomment this when using real Stripe keys:
      // const cardElement = elements.getElement(CardElement);
      // const result = await stripe.confirmCardPayment(client_secret, {
      //   payment_method: { card: cardElement },
      // });

      setTimeout(() => {
        setLoading(false);
        alert("Payment successful (mock)!");
      }, 1500);
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message || "Payment failed. Please try again.");
    }
  }; */

  return (
    {/* <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm mt-6">
      <h2 className="text-lg font-semibold mb-4 text-black">Payment</h2>

      <form onSubmit={handlePayment} className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-3">
          <CardElement
            options={{
              style: {
                base: {
                  color: "#1a1a1a",
                  fontSize: "16px",
                  fontFamily: "Nunito, sans-serif",
                  "::placeholder": { color: "#a0a0a0" },
                },
                invalid: { color: "#BF1E2E" },
              },
            }}
          />
        </div>

        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        <button
          type="submit"
          disabled={!stripe || loading}
          className={`w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : `Pay $${total}`}
        </button>
      </form>
    </div> */}
  );
}
