const partners = [
  {
    name: "Windsor Islamic Association",
    logo: "/windsor-removebg.png",
    height: "h-[8rem]",       // square, needs more height to appear same as wide
    maxWidth: "max-w-[120px]",
  },
  {
    name: "Islamic Relief Canada",
    logo: "/Islamic Relief Canada.png",
    height: "h-16",       // already wide, reduce height slightly
    maxWidth: "max-w-[120px]",
  },
];

const PartnerSection = () => {
  return (
    <section className="bg-white py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
          Our Trusted Partners
        </h2>
        <p className="text-gray-600 mb-10 text-sm sm:text-base">
          Proudly collaborating with delivery giants, Islamic organizations, and local communities.
        </p>

        {/* Balanced 2-column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center h-24 sm:h-28"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className={`object-contain mx-auto ${partner.height} ${partner.maxWidth}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
