export default function ChefDishCard({ item }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="aspect-[4/3] bg-gray-100">
        <img
          src={item.imageUrl || item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
          {typeof item.price === "number" && (
            <span className="text-sm font-bold text-primary">${item.price.toFixed(2)}</span>
          )}
        </div>
        {item.description && (
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{item.description}</p>
        )}
      </div>
    </div>
  );
}
