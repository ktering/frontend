import React from "react";

export default function ChefDashboard() {
  const chefName = localStorage.getItem("chefName") || "Chef";

  return (
    <div className="font-nunito max-w-lg mx-auto mt-20 p-6 bg-white rounded-lg shadow-md text-center">
      <h1 className="text-3xl font-bold text-primary mb-4">
        Welcome, {chefName} 👨‍🍳
      </h1>
      <p className="text-gray-600">
        This is your dashboard. We'll add stats, orders, and profile settings tomorrow!
      </p>
    </div>
  );
}
