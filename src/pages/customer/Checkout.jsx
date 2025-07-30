import { useCart } from "../../context/CartContext";
import Header from "../../components/customer/Header";
import OrderSummary from "../../components/customer/checkout/OrderSummary";
import Payment from "../../components/customer/checkout/PaymentFom";
import CustomerForm from "../../components/customer/checkout/GuestCheckoutForm";

export default function CheckoutPage() {
  const { cart } = useCart();
  return (
    <>
          <>
            <header className="bg-white px-4 sm:px-10 py-4 shadow-sm font-nunito">
                <div className=" lg:flex items-center gap-2 relative">
                  <a
                    href="/cart"
                    className="bg-primary text-white px-5 py-2 rounded-full font-medium shadow hover:bg-white hover:text-primary hover:border border-primary transition-colors text-sm"
                  >
                    ←  Back to Cart
                  </a>
                </div>
            </header>
          </>
      
      <div className="max-w-6xl mx-auto px-4 py-8 font-nunito">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
          Checkout
        </h1>
        {cart.length === 0 ? (
          <p className="text-gray-600 text-center">Your cart is empty.</p>
        ) : (
          <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            <div className="space-y-6">
              <CustomerForm  />
               <button
            /* onClick={handleProceedToPay} */
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition"
            /* disabled={loading} */
          >
            {/* {loading ? "Processing..." : `Proceed to Pay $${subtotal.toFixed(2)}`} */} Proceed to Pay
          </button>
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
