import { Facebook, Instagram, Phone, MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import foodLeft from "../../../assets/food/beef-tacos.jpg"; // Update with actual image
import foodRight from "../../../assets/food/biryani.png";  // Update with actual image



const Footer = () => {
  return (
    <footer className="bg-[#fff8f3] text-gray-800 font-nunito">
      {/* CTA Compact Section */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 px-4 py-8">
        {/* Left Dish Image */}
        <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-md">
          <img src={foodLeft} alt="Hot Item" className="object-cover w-full h-full" />
          <span className="absolute bottom-1 right-1 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm font-semibold shadow-sm">
            Hot
          </span>
        </div>

        {/* CTA Text + Button */}
        <div className="text-center md:flex-1">
          <h2 className="text-lg sm:text-xl font-semibold">Don’t Wait – Order Now!</h2>
          <p className="text-sm text-gray-600 mt-1">
            Freshly made meals delivered to your door — taste the difference.
          </p>
          <Link to="/menu">
            <button className="mt-3 bg-primary hover:bg-primary/90 text-white text-sm font-medium px-5 py-2 rounded-full transition-transform duration-200 transform hover:scale-105 active:scale-95">
              Order Now
            </button>
          </Link>
        </div>

        {/* Right Dish Image */}
        <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-md">
          <img src={foodRight} alt="New Item" className="object-cover w-full h-full" />
          <span className="absolute bottom-1 right-1 bg-purple-700 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm font-semibold shadow-sm">
            New!
          </span>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-gray-200 mt-2 py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
          {/* Navigate */}
          <div>
            <h4 className="font-semibold mb-2 text-black">Navigate</h4>
            <ul className="space-y-1 text-gray-700">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/chefs">Chefs</Link></li>
            </ul>
          </div>

          {/* Menu */}
          <div>
            <h4 className="font-semibold mb-2 text-black">Menu</h4>
            <ul className="space-y-1 text-gray-700">
              <li><Link to="/categories/trending">Trending</Link></li>
              <li><Link to="/categories/asian">Asian</Link></li>
              <li><Link to="/categories/middle-eastern">Middle Eastern</Link></li>
              <li><Link to="/categories/vegetarian">Vegetarian</Link></li>
              <li><Link to="/categories/vegan">Vegan</Link></li>
              <li><Link to="/categories/desserts">Desserts</Link></li>
            </ul>
          </div>

          {/* Contact + Socials */}
          <div>
            <h4 className="font-semibold mb-2 text-black">Contact</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2 text-sm"><Phone size={14} /> +1 (234) 567-8901</li>
              <li className="flex items-center gap-2 text-sm"><MapPin size={14} /> 123 Maple St, Toronto</li>
              <li className="flex items-center gap-2 text-sm"><Mail size={14} /> hello@kterings.com</li>
            </ul>

            <div className="flex gap-3 mt-3">
              <a href="#" className="text-gray-700 hover:text-primary"><Facebook size={18} /></a>
              <a href="#" className="text-gray-700 hover:text-primary"><Instagram size={18} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-500 py-3 border-t border-gray-200">
        ©2025 Kterings. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
