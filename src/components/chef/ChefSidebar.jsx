// import React from "react";
// import { Link } from "react-router-dom";

// export default function Sidebar({ isOpen, setIsOpen }) {
//   return (
//     <div
//       className={`fixed top-0 left-0 h-full w-64 bg-primary text-white p-6 
//         transform transition-transform duration-300 z-50
//         ${isOpen ? "translate-x-0" : "-translate-x-full"} 
//         md:translate-x-0`}
//     >
//       <h2 className="text-2xl font-bold mb-8">Chef Panel</h2>
//       <nav className="space-y-4">
//         <Link to="/chef-dashboard" className="block hover:text-gray-200">Dashboard</Link>
//         <Link to="/chef-orders" className="block hover:text-gray-200">Orders</Link>
//         <Link to="/chef-menu" className="block hover:text-gray-200">Menu</Link>
//         <Link to="/chef-earnings" className="block hover:text-gray-200">Earnings</Link>
//       </nav>
//     </div>
//   );
// }

// import React from "react";
// import { Link } from "react-router-dom";

// export default function Sidebar({ isOpen, setIsOpen }) {
//   return (
//     <div
//       className={`fixed top-0 left-0 h-full w-64 bg-primary text-white p-6 
//         transform transition-transform duration-300 z-50
//         ${isOpen ? "translate-x-0" : "-translate-x-full"} 
//         md:translate-x-0`}
//     >
//       {/* Close button for mobile */}
//       <button
//         className="absolute top-4 right-4 md:hidden text-white text-2xl"
//         onClick={() => setIsOpen(false)}
//         aria-label="Close sidebar"
//       >
//         &times;
//       </button>
//       <h2 className="text-2xl font-bold mb-8">Chef Panel</h2>
//       <nav className="space-y-4">
//         <Link to="/chef-dashboard" className="block hover:text-gray-200">Dashboard</Link>
//         <Link to="/chef-orders" className="block hover:text-gray-200">Orders</Link>
//         <Link to="/chef-menu" className="block hover:text-gray-200">Menu</Link>
//         <Link to="/chef-earnings" className="block hover:text-gray-200">Earnings</Link>
//       </nav>
//     </div>
//   );
// }

import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen }) {
  const chefName = localStorage.getItem("chefName") || "Chef";
  const chefInitial = chefName.trim().charAt(0).toUpperCase();

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
          <Link to="/chef-dashboard" className="block hover:text-gray-200">Dashboard</Link>
          <Link to="/chef-orders" className="block hover:text-gray-200">Orders</Link>
          <Link to="/chef-menu" className="block hover:text-gray-200">Menu</Link>
          <Link to="/chef-earnings" className="block hover:text-gray-200">Earnings</Link>
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
