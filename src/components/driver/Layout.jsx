// src/components/driver/DriverLayout.jsx
import { useState } from "react";
import DriverSidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <DriverSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" onClick={() => setIsOpen(false)} />}
      <div className={`flex-1 transition-all duration-300 md:ml-64`}>
        <div className="bg-white shadow-md p-4 flex items-center justify-between md:hidden">
          <h1 className="font-bold text-lg text-primary">Driver Dashboard</h1>
          <button onClick={() => setIsOpen(!isOpen)} className="text-primary text-2xl leading-none">☰</button>
        </div>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
