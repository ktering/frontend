import React, { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white px-4 sm:px-8 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <a href="/">
          <img
            src="static/red-logo.svg"
            alt="Kterings logo"
            className="h-10 w-auto"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="/" className="text-black hover:text-primary font-medium transition-colors">Home</a>
          <a href="/menu" className="text-black hover:text-primary font-medium transition-colors">Explore Menu</a>
          <a href="/chefs" className="text-black hover:text-primary font-medium transition-colors">Explore Chefs</a>
        </nav>

        {/* Desktop Button */}
        <div className="hidden md:block">
          <a
            href="/order"
            className="bg-primary text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-white hover:border border-primary hover:text-primary transition-colors"
          >
            Order Now
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 px-2 pb-2 flex flex-col gap-2 bg-white rounded shadow">
          <a href="/" className="py-2 px-2 text-black hover:text-primary font-medium rounded transition-colors">Home</a>
          <a href="/menu" className="py-2 px-2 text-black hover:text-primary font-medium rounded transition-colors">Explore Menu</a>
          <a href="/chefs" className="py-2 px-2 text-black hover:text-primary font-medium rounded transition-colors">Explore Chefs</a>
          <a
            href="/order"
            className="bg-primary text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-black hover:text-primary transition-colors mt-2 text-center"
          >
            Order Now
          </a>
        </div>
      )}
    </header>
  );
}
