import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu as MenuIcon, X } from "lucide-react";

export default function Header() {
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/menu?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMobileMenuOpen(false); // close mobile menu on search
    }
  };

  return (
    <header className="bg-white px-4 sm:px-10 py-4 mb-3 shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo */}
        <a href="/" className="font-bold text-2xl tracking-wider flex-shrink-0">
          <img src="/red-logo.svg" alt="Mateam logo" className="h-9 w-auto inline-block align-middle mr-2" />
        </a>

        {/* Desktop Search */}
        <form
          className="hidden lg:block relative w-64"
          onSubmit={handleSearchSubmit}
          autoComplete="off"
        >
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-primary text-sm"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </form>
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7">
          <a href="/menu" className="text-black hover:text-primary font-medium transition-colors">Explore Menu</a>
          <a href="/chefs" className="text-black hover:text-primary font-medium transition-colors">Explore Chefs</a>
        </nav>


        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2">
          <a
            href="/order"
            className="bg-primary text-white px-5 py-2 rounded-full font-medium shadow hover:bg-white hover:text-primary hover:border border-primary transition-colors text-sm"
          >
            Order Now
          </a>
          <a
            href="/cart"
            className="bg-white border border-gray-300 text-primary px-3 py-2 rounded-full ml-2 hover:bg-primary hover:text-white hover:border-primary transition-all"
            aria-label="Cart"
          >
            <ShoppingCart size={22} strokeWidth={2} />
          </a>
        </div>

        {/* Mobile Icons */}
        <div className="flex items-center gap-2 lg:hidden">
          <a href="/cart" aria-label="Cart" className="p-2 rounded-full hover:bg-gray-100 transition">
            <ShoppingCart size={22} strokeWidth={2} />
          </a>
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Open menu"
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            {mobileMenuOpen ? <X size={26} /> : <MenuIcon size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-0 left-0 w-full h-full z-40 bg-black/40">
          <div className="absolute top-0 right-0 bg-white shadow-lg w-72 h-full p-6 flex flex-col gap-4">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="self-end mb-2"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
            {/* Mobile Search */}
            <form
              className="relative mt-2"
              onSubmit={handleSearchSubmit}
              autoComplete="off"
            >
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-primary text-sm"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </form>
            {/* Mobile Nav Links */}
            <a href="/menu" className="block py-2 px-2 text-black hover:text-primary font-medium rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>Explore Menu</a>
            <a href="/chefs" className="block py-2 px-2 text-black hover:text-primary font-medium rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>Explore Chefs</a>
            <a href="/order" className="block bg-primary text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-white hover:text-primary hover:border border-primary transition-colors mt-2 text-center" onClick={() => setMobileMenuOpen(false)}>Order Now</a>
          </div>
        </div>
      )}
    </header>
  );
}
