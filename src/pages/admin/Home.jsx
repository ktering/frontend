import Sidebar from "../../components/admin/Sidebar";
import { useNavigate } from "react-router-dom";


export default function AdminDashboard() {
  const navigate = useNavigate();

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
              src="/admin-pfp.png"
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Total Chefs</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">45</h2>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Total Dishes</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">230</h2>
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
            <button onClick={() => navigate("/supervised/chefs/new")} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              + Add Chef
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
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
                  <th className="text-left p-3 text-gray-600">Email</th>
                  <th className="text-left p-3 text-gray-600">Status</th>
                  <th className="text-left p-3 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Replace static rows with map from API */}
                <tr className="border-b">
                  <td className="p-3">Chef Fatima</td>
                  <td className="p-3">fatima@example.com</td>
                  <td className="p-3 text-green-600">Active</td>
                  <td className="p-3">
                    <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
                      Edit
                    </button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Chef Ali</td>
                  <td className="p-3">ali@example.com</td>
                  <td className="p-3 text-yellow-600">Pending</td>
                  <td className="p-3">
                    <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
