import React, { useState, useEffect, useRef } from "react";
import {useNavigate} from "react-router-dom";

const heroImages = [
  "/biryani.png",
  "/daal-chawal.png",
  "/arab-sweet.png",
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const hasScrolled = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    function handleScroll() {
      if (!hasScrolled.current) {
        setPaused(true);
        hasScrolled.current = true;
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <section className="bg-white py-8 px-2 sm:py-12 sm:px-4 md:py-16 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left: Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl font-extrabold text-primary mb-2 md:mb-4 leading-tight">
            HOMEMADE FOOD
          </h1>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl font-extrabold text-primary mb-4 leading-tight">
            DELIVERED FAST
          </h1>
          <p className="text-black text-base sm:text-lg mb-7 max-w-md sm:max-w-lg">
          <b>Craving</b> something special? Enjoy <b>fresh</b>, <b>homemade</b> meals from local chefs ,<b> delivered </b> right to your door!</p>
          <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10 justify-center md:justify-start">
  {/* ORDER NOW button: always visible, centered on mobile */}
  <button onClick={navigate("/menu")} className="bg-primary text-white font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full shadow hover:bg-white hover:border border-primary hover:text-primary transition-colors text-base sm:text-lg mx-auto ">
    ORDER NOW
  </button>
  {/* Arrow + Text: hidden on small screens, shown on md+ */}
  <div className="items-center ml-1 sm:ml-2 relative hidden md:flex">
     {/* Arrow SVG */}
    <svg
      className="w-16 h-8 md:w-24 md:h-10 text-primary -scale-x-100 -scale-y-100 -rotate-12"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      viewBox="0 0 60 30"
      style={{ minWidth: "60px" }}
    >
      <path
        d="M2 18 Q30 5 55 22"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M52 13 L55 22 L45 30"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
    <span className="ml-1 text-primary italic font-medium text-xs sm:text-sm md:text-base font-[cursive] whitespace-nowrap">
      Go ahead,<br className="hidden xs:block" /> we know you’re hungry!
    </span>
  </div>
</div>

          
          <div className="flex gap-6 sm:gap-8 mt-4 sm:mt-6 mb-6 sm:mb-0 justify-center md:justify-start">
            <div>
              <p className="text-lg sm:text-2xl font-bold text-primary">Chefs</p>
              <p className="text-black text-sm sm:text-base font-medium">Trusted & Local</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-primary">Menus</p>
              <p className="text-black text-sm sm:text-base font-medium">Endless Choices</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-primary">Foodies</p>
              <p className="text-black text-sm sm:text-base font-medium">Satisfied Eaters</p>
            </div>
          </div>
        </div>
        {/* Right: Instantly Rotating Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center min-h-[220px] sm:min-h-[300px]">
          <img
            src={heroImages[index]}
            alt="Food"
            className="w-[200px] h-[200px] xs:w-[250px] xs:h-[250px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] lg:w-[420px] lg:h-[420px] drop-shadow-xl rounded-2xl object-cover object-center cursor-pointer"
            style={{ minWidth: "150px", minHeight: "150px" }}
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
