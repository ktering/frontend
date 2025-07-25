// const CategoryItem = ({ name, image, icon: Icon }) => {
//   return (
//     <div className="relative group inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white border border-gray-200 hover:border-primary/60 cursor-pointer transition-all duration-200">
//       {/* Hover wave */}
//       <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-full pointer-events-none" />

//       {/* Mobile icon */}
//       {Icon && (
//         <span className="sm:hidden text-primary z-10">
//           <Icon size={18} />
//         </span>
//       )}

//       {/* Desktop image */}
//       <img
//         src={image}
//         alt={name}
//         className="hidden sm:block w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full border border-gray-200 z-10"
//       />

//       {/* Text */}
//       <span className="text-sm font-medium text-gray-800 z-10 whitespace-nowrap">
//         {name}
//       </span>
//     </div>
//   );
// };

// export default CategoryItem;

const CategoryItem = ({ name, image, icon: Icon, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative group inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full cursor-pointer transition-all duration-200 border 
        ${isSelected ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-800 border-gray-200 hover:border-primary/60'}
      `}
    >
      {/* Hover or Active background overlay */}
      <div className={`absolute inset-0 rounded-full pointer-events-none transition-opacity duration-150
        ${isSelected ? 'bg-primary/20 opacity-100' : 'bg-primary/10 opacity-0 group-hover:opacity-100'}
      `} />

      {/* Icon for mobile */}
      {Icon && (
        <span className={`sm:hidden z-10 ${isSelected ? 'text-white' : 'text-primary'}`}>
          <Icon size={18} />
        </span>
      )}

      {/* Image for desktop */}
      <img
        src={image}
        alt={name}
        className={`hidden sm:block w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full border z-10 
          ${isSelected ? 'border-white' : 'border-gray-200'}`}
      />

      {/* Text */}
      <span className={`text-sm font-medium z-10 whitespace-nowrap 
        ${isSelected ? 'text-white' : 'text-gray-800'}`}>
        {name}
      </span>
    </div>
  );
};

export default CategoryItem;
