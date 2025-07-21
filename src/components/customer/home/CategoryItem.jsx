const CategoryItem = ({ name, image, icon: Icon }) => {
  return (
    <div className="relative group inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white border border-gray-200 hover:border-primary/60 cursor-pointer transition-all duration-200">
      {/* Hover wave */}
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-full pointer-events-none" />

      {/* Mobile icon */}
      {Icon && (
        <span className="sm:hidden text-primary z-10">
          <Icon size={18} />
        </span>
      )}

      {/* Desktop image */}
      <img
        src={image}
        alt={name}
        className="hidden sm:block w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full border border-gray-200 z-10"
      />

      {/* Text */}
      <span className="text-sm font-medium text-gray-800 z-10 whitespace-nowrap">
        {name}
      </span>
    </div>
  );
};

export default CategoryItem;
