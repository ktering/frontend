import React from "react";
import ChefLayout from "../../components/chef/chefLayout";

export default function ChefDashboard() {
  return (
    <ChefLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Stat Cards */}
        <div className="bg-white shadow rounded p-6">Orders Today</div>
        <div className="bg-white shadow rounded p-6">Pending Orders</div>
        <div className="bg-white shadow rounded p-6">Total Dishes</div>
        <div className="bg-white shadow rounded p-6">Customers</div>
        <div className="bg-white shadow rounded p-6">Earnings</div>
      </div>
    </ChefLayout>
  );
}
