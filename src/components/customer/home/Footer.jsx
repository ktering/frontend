// import { Facebook, Instagram, Phone, MapPin, Mail } from "lucide-react";
// import { Link } from "react-router-dom";

// const Footer = () => {
//   return (
//     <footer className="bg-[#fff8f3] text-gray-800 font-nunito">

//       {/* CTA Section */}
//       <div className="bg-[#fff8f3] px-4 py-8 font-nunito">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="mb-3 hidden sm:flex justify-center gap-2 text-primary">
//             <div className="w-6 h-0.5 bg-primary mt-2" />
//             <span className="uppercase tracking-widest text-xs font-bold">fresh. fast. flavorful.</span>
//             <div className="w-6 h-0.5 bg-primary mt-2" />
//           </div>

//           <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2 leading-tight">
//             Don’t Wait — <span className="text-primary">Order Now</span>
//           </h2>

//           <p className="text-sm sm:text-base text-gray-600 mb-4">
//             Satisfy your cravings with chef-crafted meals delivered right to your door.
//           </p>

//           <Link to="/menu">
//             <button className="bg-primary hover:bg-primary/90 text-white text-sm sm:text-base font-medium px-5 py-2 rounded-full flex items-center justify-center gap-2 mx-auto transition duration-200 shadow hover:shadow-md hover:scale-105 active:scale-95">
//               Explore the menu
//               <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mt-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//               </svg>
//             </button>
//           </Link>
//         </div>
//       </div>

//       {/* Navigation */}
//       <div className="border-t border-gray-200 px-4 py-6">
//         <div className="w-full max-w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-y-4 sm:gap-6 text-sm text-gray-700">
//           {/* Column 1: Navigate */}
//           <div>
//             <h4 className="text-base font-semibold mb-2 text-black">Navigate</h4>
//             <ul className="space-y-1.5">
//               <li><Link to="/">Home</Link></li>
//               <li><Link to="/about">About Us</Link></li>
//               <li><Link to="/menu">Menu</Link></li>
//               <li><Link to="/contact">Contact</Link></li>
//               <li><Link to="/chefs">Chefs</Link></li>
//             </ul>
//           </div>

//           {/* Column 2: Menu */}
//           <div>
//             <h4 className="text-base font-semibold mb-2 text-black">Menu</h4>
//             <ul className="space-y-1.5">
//               <li><Link to="/categories/trending">Trending</Link></li>
//               <li><Link to="/categories/asian">Asian</Link></li>
//               <li><Link to="/categories/middle-eastern">Middle Eastern</Link></li>
//               <li><Link to="/categories/vegetarian">Vegetarian</Link></li>
//               <li><Link to="/categories/vegan">Vegan</Link></li>
//               <li><Link to="/categories/desserts">Desserts</Link></li>
//             </ul>
//           </div>

//           {/* Column 3: Contact + Social */}
//           <div>
//             <h4 className="text-base font-semibold mb-2 text-black">Contact</h4>
//             <ul className="space-y-1.5">
//               <li className="flex items-center gap-2"><Phone size={16} /> +1 (234) 567-8901</li>
//               <li className="flex items-center gap-2"><MapPin size={16} /> 123 Maple St, Toronto</li>
//               <li className="flex items-center gap-2"><Mail size={16} /> hello@kterings.com</li>
//             </ul>
//             <div className="flex gap-3 mt-3">
//               <a href="#" className="text-gray-700 hover:text-primary"><Facebook size={18} /></a>
//               <a href="#" className="text-gray-700 hover:text-primary"><Instagram size={18} /></a>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom bar */}
//       <div className="text-center text-xs text-gray-500 py-3 border-t border-gray-200">
//         ©2025 Kterings. All rights reserved.
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import { Facebook, Instagram, Phone, MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#fff8f3] text-gray-800 font-nunito">

      {/* CTA Section */}
      <div className="bg-[#fff8f3] px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src="/red-logo.svg"
            alt="Kterings Logo"
            className="h-10 mx-auto mb-4"
          />

          <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 leading-tight">
            Don’t Wait — <span className="text-primary">Order Now</span>
          </h2>

          <Link to="/menu">
            <button className="bg-primary hover:bg-primary/90 text-white text-sm sm:text-base font-medium px-5 py-2 sm:px-6 sm:py-2.5 rounded-full flex items-center justify-center gap-2 mx-auto transition duration-200 shadow hover:shadow-md hover:scale-105 active:scale-95">
              Explore the menu
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mt-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200 px-4 py-6">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-700">
          
          {/* Column 1: Navigate */}
          <div>
            <h4 className="text-base font-semibold mb-2 text-black">Navigate</h4>
            <ul className="space-y-1.5">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/chefs">Chefs</Link></li>
            </ul>
          </div>

          {/* Column 2: Menu */}
          <div>
            <h4 className="text-base font-semibold mb-2 text-black">Menu</h4>
            <ul className="space-y-1.5">
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
            <h4 className="text-base font-semibold mb-2 text-black">Contact</h4>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2"><Phone size={16} /> <span>+1 (234) 567-8901</span></li>
              <li className="flex items-center gap-2"><MapPin size={16} /> <span>123 Maple St, Toronto</span></li>
              <li className="flex items-center gap-2"><Mail size={16} /> <span>hello@kterings.com</span></li>
            </ul>
            <div className="flex gap-3 mt-3">
              <a href="#" className="text-gray-700 hover:text-primary"><Facebook size={18} /></a>
              <a href="#" className="text-gray-700 hover:text-primary"><Instagram size={18} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-xs text-gray-500 py-3 border-t border-gray-200">
        ©2025 Kterings. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;



// import { Facebook, Instagram, Phone, MapPin, Mail } from "lucide-react";
// import { Link } from "react-router-dom";

// const Footer = () => {
//   return (
//     <footer className="bg-[#fff8f3] text-gray-800 font-nunito">

//       {/* Main Footer Grid */}
//       <div className="border-t border-gray-200 px-4 py-10">
//         <div className="w-full max-w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-700">
          
//           {/* Column 1: Logo + Tagline */}
//           <div>
//             <img
//               src="/red-logo.svg" // Replace with your actual logo
//               alt="Kterings Logo"
//               className="h-10 mb-3"
//             />
//           </div>

//           {/* Column 2: Navigate */}
//           <div>
//             <h4 className="text-base font-semibold mb-2 text-black">Navigate</h4>
//             <ul className="space-y-1.5">
//               <li><Link to="/">Home</Link></li>
//               <li><Link to="/about">About Us</Link></li>
//               <li><Link to="/menu">Menu</Link></li>
//               <li><Link to="/contact">Contact</Link></li>
//               <li><Link to="/chefs">Chefs</Link></li>
//             </ul>
//           </div>

//           {/* Column 3: Menu */}
//           <div>
//             <h4 className="text-base font-semibold mb-2 text-black">Menu</h4>
//             <ul className="space-y-1.5">
//               <li><Link to="/categories/trending">Trending</Link></li>
//               <li><Link to="/categories/asian">Asian</Link></li>
//               <li><Link to="/categories/middle-eastern">Middle Eastern</Link></li>
//               <li><Link to="/categories/vegetarian">Vegetarian</Link></li>
//               <li><Link to="/categories/vegan">Vegan</Link></li>
//               <li><Link to="/categories/desserts">Desserts</Link></li>
//             </ul>
//           </div>

//           {/* Column 4: Contact + Social */}
//           <div>
//             <h4 className="text-base font-semibold mb-2 text-black">Contact</h4>
//             <ul className="space-y-1.5">
//               <li className="flex items-center gap-2"><Phone size={16} /> +1 (234) 567-8901</li>
//               <li className="flex items-center gap-2"><MapPin size={16} /> 123 Maple St, Toronto</li>
//               <li className="flex items-center gap-2"><Mail size={16} /> hello@kterings.com</li>
//             </ul>
//             <div className="flex gap-3 mt-3">
//               <a href="#" className="text-gray-700 hover:text-primary"><Facebook size={18} /></a>
//               <a href="#" className="text-gray-700 hover:text-primary"><Instagram size={18} /></a>
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="text-center text-xs text-gray-500 py-3 border-t border-gray-200">
//         ©2025 Kterings. All rights reserved.
//       </div>
//     </footer>
//   );
// };

// export default Footer;
