const ChefCard = ({ chef, onClick, children }) => (
  <div
    className="bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center p-6 group border hover:border-primary"
    onClick={onClick}
  >
    <div className="w-20 h-20 mb-3 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary group-hover:scale-105 transition">
      <img
        src={chef.photoUrl}
        alt={chef.name}
        className="w-full h-full object-cover rounded-full"
      />
    </div>
    <h2 className="text-lg font-bold mb-1 text-center group-hover:text-primary">
      {chef.name}
    </h2>
    <p className="text-gray-600 text-sm text-center mb-2 line-clamp-2">
      {chef.bio || "No description."}
    </p>
    {chef.kitchenLocation && (
      <div className="text-xs text-gray-400 mb-2">{chef.kitchenLocation}</div>
    )}
    {chef.specialties?.length > 0 && (
      <div className="flex gap-2 flex-wrap justify-center mt-auto mb-2">
        {chef.specialties.map((spec, idx) => (
          <span
            key={idx}
            className="bg-primary/10 text-primary px-2 py-[2px] rounded-full text-xs font-medium"
          >
            {spec}
          </span>
        ))}
      </div>
    )}
    {children /* Extra controls for admin panel */}
  </div>
);
export default ChefCard;