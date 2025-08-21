// components/admin/Sidebar.jsx
import { FaUtensils, FaUserTie, FaChartBar, FaShoppingCart } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../../api/adminAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dishesOpen, setDishesOpen] = useState(
    location.pathname.startsWith("/supervised/dishes")
  );
  async function handleLogout() {
    try { await logoutUser(); }
    finally { navigate("/supervised/login", { replace: true }); }
  }

  return (
    <aside className="w-64 bg-white h-screen border-r border-gray-200 p-4 fixed">
      <div className="text-2xl font-bold text-red-500 mb-8">Kterings Admin</div>
      <nav className="space-y-4">
        <Link to="/supervised/" className="flex items-center gap-3 text-gray-700 hover:text-red-500">
          <FaChartBar /> Dashboard
        </Link>

        {/* Chefs */}
        <Link to="/supervised/chefs" className="flex items-center gap-3 hover:text-red-500">
          <FaUserTie /> Kterers
        </Link>

        {/* Dishes with Subitems */}
        <div>
          <div
            onClick={() => setDishesOpen(!dishesOpen)}
            className="flex items-center justify-between cursor-pointer hover:text-red-500"
          >
            <div className="flex items-center gap-3">
              <FaUtensils /> Dishes
            </div>
            <span className="text-xs text-gray-500 pr-2">{dishesOpen ? "▲" : "▼"}</span>
          </div>

          {dishesOpen && (
            <div className="ml-5 mt-2 border-l border-gray-200 pl-3 space-y-2">
              <Link
                to="/supervised/dishes/chef"
                className="block py-1 px-2 rounded-md hover:bg-red-50 hover:text-red-600 transition"
              >
                ➤ Manage by Kterer
              </Link>
              <Link
                to="/supervised/dishes/category"
                className="block py-1 px-2 rounded-md hover:bg-red-50 hover:text-red-600 transition"
              >
                ➤ Manage by Category
              </Link>
            </div>
          )}
        </div>

        {/* Orders */}
        <Link to="/supervised/orders" className="flex items-center gap-3 hover:text-red-500">
          <FaShoppingCart /> Orders
        </Link>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Logout
        </button>
      </nav>
    </aside>
  );
}
