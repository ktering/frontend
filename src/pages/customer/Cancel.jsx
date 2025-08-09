import React from "react";

export default function Cancel() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center font-nunito">
      <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Cancelled</h1>
      <p className="text-gray-700">
        Your checkout was cancelled. You can edit your cart and try again anytime.
      </p>
    </div>
  );
}
