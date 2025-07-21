import React, { useState, useEffect, useRef } from "react";

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
            TASTY FOOD COMING TO YOU
          </h1>
          <p className="text-black text-lg mb-7 max-w-lg">
            Your time is precious, and we know your struggle only to get your favorite food. Get your job done and let us lessen your hustle!
          </p>
          <div className="flex items-center gap-4 mb-10">
            <button className="bg-primary text-white font-bold px-6 py-3 rounded-full shadow hover:bg-white hover:border border-primary hover:text-primary transition-colors">
              ORDER NOW
            </button>
            <button className="flex items-center gap-2 text-primary font-semibold border border-primary rounded-full px-6 py-3 bg-white hover:bg-primary hover:text-white transition-colors">
              <span role="img" aria-label="pizza">🍕</span> WHAT TO EAT
            </button>
          </div>
          <div className="flex gap-8 mt-6">
            <div>
              <p className="text-2xl font-bold text-primary">5K+</p>
              <p className="text-black font-medium">Merchants</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">12K+</p>
              <p className="text-black font-medium">Yummy Menus</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">500K+</p>
              <p className="text-black font-medium">Happy Customers</p>
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
