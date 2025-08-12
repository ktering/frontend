
import React, { useState } from "react";
import Sidebar from "../chef/ChefSidebar";

export default function ChefLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main content wrapper */}
      <div
        className={`flex-1 transition-all duration-300 md:ml-64`}
      >
        {/* Topbar for mobile */}
        <div className="bg-white shadow-md p-4 flex items-center justify-between md:hidden">
          {/* Chef name */}
          <h1 className="font-bold text-lg text-primary">
            {/* {localStorage.getItem("chefName") || "Chef"} */}
            Chef Dashboard
          </h1>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-primary text-2xl leading-none"
          >
            ☰
          </button>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
