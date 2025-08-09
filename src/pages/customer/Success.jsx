import React from "react";

export default function Success() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center font-nunito">
      <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
      <p className="text-gray-700">
        Thank you for your order. We’ll start preparing your dishes shortly.
      </p>
    </div>
  );
}
