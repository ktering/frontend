import React, { useState, useEffect, useRef } from "react";
import { ArrowBigLeft } from "lucide-react";

const heroImages = [
    "/static/biryani.png",
    "/static/daal-chawal.png",
   "/static/arab-sweet.png",
  
];

  export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const hasScrolled = useRef(false);

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
    <section className="bg-white py-5 md:px-12">
      <div className="max-w-7xl mx-auto flex  flex-col md:flex-row items-center justify-between gap-12">
        {/* Left: Text Content */}
        <div className=" ">
          <h1 className="text-4xl md:text-5xl text-primary mb-4">
            HOMEMADE FOOD 
          </h1>
          <h1 className="text-4xl md:text-5xl text-primary mb-4">
            DELIVERED FAST
          </h1>
          <p className="text-black text-lg mb-7 max-w-lg">
            Busy day? Treat yourself to authentic homemade meals, prepared by local chefs and delivered hot to your door. Skip the stress—order now and enjoy comfort food made just for you!
          </p>
          <div className="flex items-center gap-4 mb-10 justify-center">
  <button className="bg-primary text-white font-bold px-8 py-3 rounded-full shadow hover:bg-white hover:border border-primary hover:text-primary transition-colors text-lg">
    ORDER NOW
  </button>
  <div className="flex items-center ml-2 relative">
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
    <span className="ml-1 text-primary italic font-medium text-sm md:text-base whitespace-nowrap">
      Go ahead,<br/> we know you’re hungry!
    </span>
  </div>
</div>

          <div className="flex gap-8 mt-6">
        <div>
        <p className="text-2xl font-bold text-primary">Chefs</p>
        <p className="text-black font-medium">Trusted & Local</p>
        </div>
        <div>
        <p className="text-2xl font-bold text-primary">Menus</p>
        <p className="text-black font-medium">Endless Choices</p>
        </div>
        <div>
    <p className="text-2xl font-bold text-primary">Foodies</p>
    <p className="text-black font-medium">Satisfied Eaters</p>
  </div>
</div>

        </div>
        {/* Right: Instantly Rotating Image */}
        <div className="flex  items-center justify-center h-[450px]">
           <img
            src={heroImages[index]}
            alt="Food"
            className="w-[350px] h-[350px] md:w-[420px] md:h-[420px] drop-shadow-xl rounded-2xl object-cover object-center cursor-pointer"
            style={{ minWidth: "250px", minHeight: "250px" }}
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
