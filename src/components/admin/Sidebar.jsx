// components/admin/Sidebar.jsx
import { 
  FaUtensils, 
  FaUserTie, 
  FaChartBar, 
  FaShoppingCart, 
  FaSignOutAlt 
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../api/adminAuth";
import { useState } from "react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [dishesOpen, setDishesOpen] = useState(
    location.pathname.startsWith("/supervised/dishes")
  );

  async function handleLogout() {
    try {
      await logoutUser();
    } finally {
      navigate("/supervised/login", { replace: true });
    }
  }

  // Main nav links (without Dishes)
  const navItems = [
    { path: "/supervised/", label: "Dashboard", icon: <FaChartBar className="inline-block mr-3 text-lg" /> },
    { path: "/supervised/chefs", label: "Kterers", icon: <FaUserTie className="inline-block mr-3 text-lg" /> },
    { path: "/supervised/orders", label: "Orders", icon: <FaShoppingCart className="inline-block mr-3 text-lg" /> },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-primary text-white flex flex-col
        transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
    >
      {/* Close button for mobile */}
      <button
        className="absolute top-4 right-4 md:hidden text-white text-2xl"
        onClick={() => setIsOpen(false)}
        aria-label="Close sidebar"
      >
        &times;
      </button>

      {/* Sidebar content */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-8">Kterings Admin</h2>
        <nav className="space-y-4">
          {/* Simple nav items */}
          {navItems.map(({ path, label, icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`block relative px-4 py-2 rounded-r-full flex items-center transition-colors duration-300
                  ${isActive ? "bg-white text-primary font-semibold" : "hover:text-gray-200"}`}
              >
                {isActive && (
                  <span className="absolute top-0 left-0 h-full w-2 bg-white rounded-r-full"></span>
                )}
                {icon}
                {label}
              </Link>
            );
          })}

          {/* Collapsible Dishes menu */}
          <div>
            <div
              onClick={() => setDishesOpen(!dishesOpen)}
              className="flex items-center justify-between cursor-pointer px-4 py-2 rounded-r-full hover:text-gray-200 transition"
            >
              <div className="flex items-center">
                <FaUtensils className="inline-block mr-3 text-lg" />
                <span>Dishes</span>
              </div>
              <span className="text-xs">{dishesOpen ? "▲" : "▼"}</span>
            </div>

            {dishesOpen && (
              <div className="ml-8 mt-2 space-y-2">
                <Link
                  to="/supervised/dishes/chef"
                  className="block py-1 px-2 rounded-md hover:bg-white hover:text-primary transition"
                >
                  ➤ Manage by Kterer
                </Link>
                <Link
                  to="/supervised/dishes/category"
                  className="block py-1 px-2 rounded-md hover:bg-white hover:text-primary transition"
                >
                  ➤ Manage by Category
                </Link>
              </div>
            )}
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left block relative px-4 py-2 rounded-r-full flex items-center hover:text-gray-200 transition"
          >
            <FaSignOutAlt className="inline-block mr-3 text-lg" />
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
}
