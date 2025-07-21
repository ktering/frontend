
import { Facebook, Instagram, Phone, MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#fff8f3] text-gray-800 font-nunito">
      {/* CTA */}
      <div className="max-w-4xl mx-auto text-center px-4 py-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">Don’t Wait – Order Now!</h2>
        <p className="text-sm text-gray-600">
          Freshly made meals delivered to your door — taste the difference.
        </p>
        <Link to="/menu">
          <button className="mt-4 bg-primary hover:bg-primary/90 text-white text-sm font-medium px-6 py-2 rounded-full transition-transform duration-200 transform hover:scale-105 active:scale-95">
            Order Now
          </button>
        </Link>
      </div>

      {/* Navigation */}
     {/* Navigation */}
<div className="border-t border-gray-200 px-4 py-8">
  <div className="w-full max-w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-y-6 sm:gap-8 text-sm text-gray-700">
    {/* Column 1: Navigate */}
    <div>
      <h4 className="text-base font-semibold mb-3 text-black">Navigate</h4>
      <ul className="space-y-2">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/menu">Menu</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/chefs">Chefs</Link></li>
      </ul>
    </div>

    {/* Column 2: Menu */}
    <div>
      <h4 className="text-base font-semibold mb-3 text-black">Menu</h4>
      <ul className="space-y-2">
        <li><Link to="/categories/trending">Trending</Link></li>
        <li><Link to="/categories/asian">Asian</Link></li>
        <li><Link to="/categories/middle-eastern">Middle Eastern</Link></li>
        <li><Link to="/categories/vegetarian">Vegetarian</Link></li>
        <li><Link to="/categories/vegan">Vegan</Link></li>
        <li><Link to="/categories/desserts">Desserts</Link></li>
      </ul>
    </div>

    {/* Column 3: Contact + Social */}
    <div>
      <h4 className="text-base font-semibold mb-3 text-black">Contact</h4>
      <ul className="space-y-2">
        <li className="flex items-center gap-2"><Phone size={16} /> +1 (234) 567-8901</li>
        <li className="flex items-center gap-2"><MapPin size={16} /> 123 Maple St, Toronto</li>
        <li className="flex items-center gap-2"><Mail size={16} /> hello@kterings.com</li>
      </ul>
      <div className="flex gap-3 mt-4">
        <a href="#" className="text-gray-700 hover:text-primary"><Facebook size={18} /></a>
        <a href="#" className="text-gray-700 hover:text-primary"><Instagram size={18} /></a>
      </div>
    </div>
  </div>
</div>


      {/* Bottom bar */}
      <div className="text-center text-xs text-gray-500 py-4 border-t border-gray-200">
        ©2025 Kterings. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
