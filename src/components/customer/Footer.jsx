import { Facebook, Instagram, Phone, MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#fff8f3] text-gray-800 font-nunito">

      {/* CTA Section */}
      <div className="bg-[#fff8f3] px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Small Logo */}
          <img
            src="/red-logo.svg"
            alt="Kterings Logo"
            className="h-10 mx-auto mb-4"
          />

          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4 leading-tight">
            Don’t Wait — <span className="text-primary">Order Now</span>
          </h2>

          <Link to="/menu">
            <button className="group bg-primary text-white text-sm sm:text-base font-medium px-5 py-2 rounded-full flex items-center justify-center gap-2 mx-auto transition duration-200 shadow hover:bg-white hover:text-primary hover:border hover:border-primary hover:shadow-md hover:scale-105 active:scale-95">
              Explore the menu
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mt-[1px] transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </Link>

        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200 px-4 py-6">
        <div className="w-full max-w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-y-6 sm:gap-6 text-sm text-gray-700">

          {/* Column 1: Navigate */}
          <div className="text-center sm:text-left">
            <h4 className="text-base font-semibold mb-2 text-black">Navigate</h4>
            <ul className="space-y-1.5">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/chefs">Kterers</Link></li>
            </ul>
          </div>

          {/* Column 2: Menu */}
          {/* Column 2: Menu */}
          <div className="text-center sm:text-left">
            <h4 className="text-base font-semibold mb-2 text-black">Menu</h4>
            <ul className="space-y-1.5">
              <li><Link to="/menu?category=trending">Trending</Link></li>
              <li><Link to="/menu?category=asian">Asian</Link></li>
              <li><Link to="/menu?category=middle-eastern">Middle Eastern</Link></li>
              <li><Link to="/menu?category=vegetarian">Vegetarian</Link></li>
              <li><Link to="/menu?category=vegan">Vegan</Link></li>
              <li><Link to="/menu?category=desserts">Desserts</Link></li>
            </ul>
          </div>


          {/* Column 3: Contact + Social */}
          <div className="text-center sm:text-left">
            <h4 className="text-base font-semibold mb-2 text-black">Contact</h4>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2 justify-center sm:justify-start"><Phone size={16} /> +1 (226) 3405041</li>
              <li className="flex items-center gap-2 justify-center sm:justify-start"><MapPin size={16} /> Windsor, Canada</li>
              <li className="flex items-center gap-2 justify-center sm:justify-start"><Mail size={16} />info@kterings.com</li>
            </ul>
            <div className="flex gap-3 justify-center sm:justify-start mt-3">
              <a href="https://www.facebook.com/profile.php?id=61552576481418" className="text-gray-700 hover:text-primary"><Facebook size={18} /></a>
              <a href="https://www.instagram.com/kterings/" className="text-gray-700 hover:text-primary"><Instagram size={18} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="text-center text-xs text-gray-500 py-3 border-t border-gray-200">
        ©2025 Kterings. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

