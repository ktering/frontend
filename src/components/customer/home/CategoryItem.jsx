const CategoryItem = ({ name, image }) => {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-full bg-white shadow hover:shadow-md cursor-pointer transition">
      <img
        src={image}
        alt={name}
        className="w-10 h-10 object-cover rounded-full border border-gray-200"
      />
      <span className="text-sm font-medium text-gray-800">{name}</span>
    </div>
  );
};

export default CategoryItem;
