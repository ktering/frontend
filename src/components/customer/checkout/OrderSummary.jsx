import { useCart } from "../../../context/CartContext";

export default function OrderSummary() {
  const { cart, note } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 2.5; // Edit delivery here 
  const total = subtotal + deliveryFee;

  return (
    <div className="border rounded-lg p-5 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Order Summary</h2>

      <div className="space-y-3">
        {cart.map((item) => (
          <div key={item._id} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-md"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {item.quantity} × ${item.price.toFixed(2)}
                </p>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-800">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="my-4 border-t border-gray-200"></div>

      {note && (
        <p className="text-xs text-gray-600 mb-2">
          <strong>Note:</strong> {note}
        </p>
      )}

      <div className="space-y-1 text-sm">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Delivery Fee</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-900 text-base mt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
