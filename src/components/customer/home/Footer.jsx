import { Facebook, Instagram, Phone, MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import foodLeft from "../../../assets/food/beef-tacos.jpg"; // Update with actual image
import foodRight from "../../../assets/food/biryani.png";  // Update with actual image


const Footer = () => {
  return (
    <footer className="bg-[#fff8f3] text-gray-800 mt-20 font-nunito">
      {/* CTA Section */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 px-4 py-12">
        {/* Left Image */}
        <div className="relative rotate-3">
          <img src={foodLeft} alt="Hot Burger" className="w-32 sm:w-40 rounded-xl shadow-lg" />
          <span className="absolute top-1 left-1 bg-purple-700 text-white text-xs px-2 py-1 rounded-full shadow-sm font-semibold">
            Hot
          </span>
        </div>

        {/* Text & Button */}
        <div className="text-center max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Don't Wait - Order Now!</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Fresh ingredients, mouth-watering recipes, and a passion for good food — delivered to your door or ready for pick-up.
          </p>
          <Link to="/menu">
            <button className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-6 py-2 rounded-full transition-transform duration-200 transform hover:scale-105 active:scale-95 mt-4">
              Order Now
            </button>
          </Link>
        </div>

        {/* Right Image */}
        <div className="relative -rotate-3">
          <img src={foodRight} alt="New Toast" className="w-32 sm:w-40 rounded-xl shadow-lg" />
          <span className="absolute top-1 right-1 bg-purple-700 text-white text-xs px-2 py-1 rounded-full shadow-sm font-semibold">
            New!
          </span>
        </div>
      </div>

      {/* Navigation & Info */}
      <div className="bg-white border-t border-gray-200 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 px-4 text-sm">
          {/* Navigate */}
          <div>
            <h4 className="font-semibold mb-3">Navigate</h4>
            <ul className="space-y-2">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/chefs">Chefs</Link></li>
            </ul>
          </div>

          {/* Menu */}
          <div>
            <h4 className="font-semibold mb-3">Menu</h4>
            <ul className="space-y-2">
              <li><Link to="/categories/trending">Trending</Link></li>
              <li><Link to="/categories/asian">Asian</Link></li>
              <li><Link to="/categories/middle-eastern">Middle Eastern</Link></li>
              <li><Link to="/categories/vegetarian">Vegetarian</Link></li>
              <li><Link to="/categories/vegan">Vegan</Link></li>
              <li><Link to="/categories/desserts">Desserts</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="font-semibold mb-3">Follow Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2"><Facebook size={16} /> Facebook</li>
              <li className="flex items-center gap-2"><Instagram size={16} /> Instagram</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2"><Phone size={16} /> +1 (234) 567-8901</li>
              <li className="flex items-center gap-2"><MapPin size={16} /> 123 Maple St, Toronto, Canada</li>
              <li className="flex items-center gap-2"><Mail size={16} /> hello@kterings.com</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-xs text-gray-500 py-4 border-t border-gray-200">
        ©2025, Kterings | All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
