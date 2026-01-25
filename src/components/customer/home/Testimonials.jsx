const testimonials = [
  {
    name: "Ayesha Khan",
    quote: "The biryani was just like home! I love that I can order real homemade food from my own city.",
    orderLabel: "Ordered Biryani",
    orderLink: "/products/biryani", // Adjust the link after adding menu page 
  },
  {
    name: "Emily Thompson",
    quote: "Prompt delivery and genuinely tasty food. The homemade desserts are a must-try.",
    orderLabel: "Ordered Kheer",
    orderLink: "/products/kheer",
  },
  {
    name: "Aarav Sharma",
    quote: "Kterings connects you to the best home Kterers. Everything is fresh and made with love.",
    orderLabel: "Ordered Karhai",
    orderLink: "/products/karhai",
  },
];


export default function TestimonialsSection() {
  return (
    <section className="bg-white py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Heading */}
        <h2 className="text-3xl font-bold mb-8 text-center md:text-left">
          Testimonials
        </h2>
        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          {/* IMAGE */}
          <div className="w-full md:w-1/2 flex-shrink-0">
            <img
              src="/testimonials.jpg"
              alt="Karhai Kterings"
              className="rounded-lg shadow-lg object-cover w-full h-64 md:h-[28rem]"
            />
          </div>
          {/* TESTIMONIALS */}
          <div className="w-full md:w-1/2 flex flex-col justify-center m-auto">
            <div className="flex flex-col gap-8">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="relative pl-8 pb-4 border-b last:border-b-0"
                >
                  <span className="absolute left-0 top-0 text-primary text-2xl leading-none font-bold">
                    “
                  </span>
                  <p className="text-gray-700 mb-2">{t.quote}</p>
                  <span className="font-semibold block mb-2">{t.name}</span>
                  {/* <a
                    href={t.orderLink}
                    className="inline-block bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition hover:bg-primary/90"
                  >
                    {t.orderLabel}
                  </a> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}   
