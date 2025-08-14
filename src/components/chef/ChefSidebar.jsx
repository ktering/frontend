import { Link, useLocation,useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaClipboardList, FaUtensils, FaDollarSign,FaSignOutAlt  } from "react-icons/fa";
import { logoutUser } from "../../api/chefAuth";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const chefName = localStorage.getItem("chefName") || "Chef";
  const chefInitial = chefName.trim().charAt(0).toUpperCase();
  const location = useLocation();
  async function handleLogout() {
    try {
      await logoutUser();                 // must remove token, name, etc.
    } finally {
      navigate("/chef/login", { replace: true });   // or navigate("/chef/login", { replace: true })
    }
  }
  
  // List of nav items with icons
  const navItems = [
    { path: "/chef-dashboard", label: "Dashboard", icon: <FaTachometerAlt className="inline-block mr-3 text-lg" /> },
    { path: "/chef-orders", label: "Orders", icon: <FaClipboardList className="inline-block mr-3 text-lg" /> },
    { path: "/chef-dishes", label: "Dishes", icon: <FaUtensils className="inline-block mr-3 text-lg" /> },
    { path: "/chef-earnings", label: "Earnings", icon: <FaDollarSign className="inline-block mr-3 text-lg" /> },
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
        <h2 className="text-2xl font-bold mb-8">Chef Panel</h2>
        <nav className="space-y-4">
          {navItems.map(({ path, label, icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`block relative px-4 py-2 rounded-r-full transition-colors duration-300 flex items-center
                  ${isActive 
                    ? "bg-white text-primary font-semibold"
                    : "hover:text-gray-200"
                  }`}
              >
                {/* Left side highlight bar */}
                {isActive && (
                  <span className="absolute top-0 left-0 h-full w-2 bg-white rounded-r-full"></span>
                )}
                {/* Icon */}
                {icon}
                {/* Label */}
                {label}
              </Link>
            );
          })}
          <button
    type="button"
    onClick={handleLogout}
    className="w-full text-left block relative px-4 py-2 rounded-r-full transition-colors duration-300 flex items-center hover:text-gray-200"
  >
    <FaSignOutAlt className="inline-block mr-3 text-lg" />
    Logout
  </button>
        </nav>
      </div>
      {/* Bottom chef info */}
      <div className="p-4 border-t border-white/30 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center font-bold text-lg">
          {chefInitial}
        </div>
        <span className="text-white font-medium">{chefName}</span>
      </div>
    </div>
  );
}
