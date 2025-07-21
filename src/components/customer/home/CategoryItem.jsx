// const CategoryItem = ({ name, image }) => {
//   return (
//     <div className="relative overflow-hidden group flex items-center gap-3 px-3 py-2 rounded-full bg-white border border-gray-200 hover:border-primary/60 cursor-pointer transition-all duration-300">
//       {/* Wave animation */}
//       <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"></div>


//       {/* Content */}
//       <img
//         src={image}
//         alt={name}
//         className="w-10 h-10 object-cover rounded-full border border-gray-200 z-10"
//       />
//       <span className="text-sm font-medium text-gray-800 z-10">{name}</span>
//     </div>
//   );
// };
const CategoryItem = ({ name, image }) => {
  return (
    <div className="relative inline-flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-2 rounded-full bg-white border border-gray-200 hover:border-primary/60 cursor-pointer transition-all duration-200 group">
      {/* Hover background */}
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-full pointer-events-none"></div>

      {/* Image */}
      <img
        src={image}
        alt={name}
        className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full border border-gray-200 z-10"
      />

      {/* Text */}
      <span className="text-xs sm:text-sm font-medium text-gray-800 z-10 whitespace-nowrap">
        {name}
      </span>
    </div>
  );
};

export default CategoryItem;
