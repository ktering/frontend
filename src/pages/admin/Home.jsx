// pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";

// API calls
import { fetchAllDishes } from "../../api/dish";
import { getAllChefs } from "../../api/chef";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [chefs, setChefs] = useState([]);
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [chefsData, dishesData] = await Promise.all([
          getAllChefs(),
          fetchAllDishes(),
        ]);
        setChefs(chefsData);
        setDishes(dishesData);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    }

    loadData();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <img
              src="https://i.pravatar.cc/40"
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Total Chefs</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">{chefs.length}</h2>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Total Dishes</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">{dishes.length}</h2>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Pending Orders</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">18</h2>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate("/supervised/chefs/new")}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              + Add Chef
            </button>
            <button
              onClick={() => navigate("/supervised/dishes/new")}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              + Add Dish
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
              View Orders
            </button>
          </div>
        </div>

        {/* Recent Chefs Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Chefs</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3 text-gray-600">Name</th>
                  <th className="text-left p-3 text-gray-600">Status</th>
                  <th className="text-left p-3 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {chefs.length > 0 ? (
                  chefs.map((chef) => (
                    <tr className="border-b" key={chef._id}>
                      <td className="p-3">{chef.name}</td>

                      {/* Show status from isActive boolean */}
                      <td className={`p-3 ${chef.isActive ? "text-green-600" : "text-yellow-600"}`}>
                        {chef.isActive ? "Active" : "Inactive"}
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => navigate(`/supervised/chefs/${chef._id}/edit`)}
                          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No chefs found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
