// components/admin/Sidebar.jsx
import { FaUtensils, FaUserTie, FaChartBar, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white h-screen border-r border-gray-200 p-4 fixed">
      <div className="text-2xl font-bold text-red-500 mb-8">Kterings Admin</div>
      <nav className="space-y-4">
        <Link to="/admin" className="flex items-center gap-3 text-gray-700 hover:text-red-500">
          <FaChartBar /> Dashboard
        </Link>
        <Link to="/supervised/chefs" className="flex items-center gap-3 text-gray-700 hover:text-red-500">
          <FaUserTie /> Chefs
        </Link>
        <Link to="/supervised/dishes" className="flex items-center gap-3 text-gray-700 hover:text-red-500">
          <FaUtensils /> Dishes
        </Link>
        <Link to="/admin/orders" className="flex items-center gap-3 text-gray-700 hover:text-red-500">
          <FaShoppingCart /> Orders
        </Link>
      </nav>
    </aside>
  );
}
