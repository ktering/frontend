export default function KteringsHowItWorks() {
  return (
    <section className="bg-white py-14 px-2 sm:px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h3 className="text-primary font-semibold tracking-widest uppercase mb-2 text-sm">
          Our Service
        </h3>
        <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-12">
          How Does It Work?
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-8">
          {/* Step 1 */}
          <div className="flex-1 flex flex-col items-center text-center px-4">
            <img
              src="/ordering.svg"
              alt="Browse & Order"
              className="w-40 h-40 mb-5 object-contain"
              draggable={false}
            />
            <h4 className="text-lg sm:text-xl font-bold text-primary mb-2">Browse & Order</h4>
            <p className="text-black/80 text-sm sm:text-base">
              Find your favorite meal and order in just a few taps.
            </p>
          </div>
          {/* Step 2 */}
          <div className="flex-1 flex flex-col items-center text-center px-4">
            <img
              src="/chef.svg"
              alt="Chef Prepares"
              className="w-40 h-40 mb-5 object-contain"
              draggable={false}
            />
            <h4 className="text-lg sm:text-xl font-bold text-primary mb-2">Chef Prepares</h4>
            <p className="text-black/80 text-sm sm:text-base">
              A home-based chef (Kterer) cooks your meal fresh, just for you.
            </p>
          </div>
          {/* Step 3 */}
          <div className="flex-1 flex flex-col items-center text-center px-4">
            <img
              src="/delivering.svg"
              alt="Delivered to You"
              className="w-40 h-40 mb-5 object-contain"
              draggable={false}
            />
            <h4 className="text-lg sm:text-xl font-bold text-primary mb-2">Delivered to You</h4>
            <p className="text-black/80 text-sm sm:text-base">
              Our driver brings your order hot and fast to your doorstep.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
