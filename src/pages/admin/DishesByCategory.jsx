import { useEffect, useState } from "react";
import {
    fetchAllDishes,
    fetchDishesByCategory,
} from "../../api/dish";
import { Link } from "react-router-dom";
import { deleteDishAdmin } from "../../api/admin";

import Sidebar from "../../components/admin/Sidebar";
import AdminDishCard from "../../components/admin/AdminDishCard";
import { updateDishAvailability } from "../../api/dish"; 

const categories = [
    { id: "all", name: "All" },
    { id: "trending", name: "Trending" },
    { id: "asian", name: "Asian" },
    { id: "middle-eastern", name: "Middle Eastern" },
    { id: "vegetarian", name: "Vegetarian" },
    { id: "vegan", name: "Vegan" },
    { id: "desserts", name: "Desserts" },
];

const DishesByCategory = () => {
    const [dishes, setDishes] = useState([]);
    const [allDishes, setAllDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [dishToDelete, setDishToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = (dish) => {
        setDishToDelete(dish);
        setShowDeleteModal(true);
    };

    const handleToggleAvailability = async (dish) => {
  try {
    await updateDishAvailability(dish._id, !dish.available);
    setDishes((prev) =>
      prev.map((d) =>
        d._id === dish._id ? { ...d, available: !dish.available } : d
      )
    );
  } catch (err) {
    console.error("Failed to update availability:", err.message);
  }
};

    const confirmDelete = async () => {
        if (!dishToDelete) return;

        try {
            await deleteDishAdmin(dishToDelete._id);
            setDishes((prev) => prev.filter((d) => d._id !== dishToDelete._id));
            setAllDishes((prev) => prev.filter((d) => d._id !== dishToDelete._id));
        } catch (err) {
            console.error("Failed to delete dish:", err.message);
        } finally {
            setShowDeleteModal(false);
            setDishToDelete(null);
        }
    };

    useEffect(() => {
        loadDishes();
    }, []);

    const loadDishes = async () => {
        setLoading(true);
        const data = await fetchAllDishes();
        setDishes(data);
        setAllDishes(data);
        setLoading(false);
    };

    const handleCategorySelect = async (categoryId) => {
        setSelectedCategory(categoryId);
        let filtered = [];

        if (categoryId === "all") {
            filtered = allDishes;
        } else {
            const result = await fetchDishesByCategory(categoryId);
            filtered = result;
        }

        applyFilter(selectedFilter, filtered);
    };

    const handleFilterChange = (value) => {
        setSelectedFilter(value);
        const base =
            selectedCategory === "all"
                ? allDishes
                : allDishes.filter(
                    (dish) =>
                        dish.category.toLowerCase() === selectedCategory.toLowerCase()
                );

        applyFilter(value, base);
    };

    const applyFilter = (filterValue, base) => {
        let filtered = [...base];

        switch (filterValue) {
            case "halal":
                filtered = filtered.filter((dish) => dish.halal);
                break;
            case "kosher":
                filtered = filtered.filter((dish) => dish.kosher);
                break;
            case "noNuts":
                filtered = filtered.filter((dish) => !dish.containsNuts);
                break;
            default:
                break;
        }

        setDishes(filtered);
    };

    const handleEdit = (dish) => {
        navigate(`/supervised/dishes/edit/${dish._id}`);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <main className="flex-1 ml-64 p-8 font-nunito">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Manage Dishes by Category</h1>
                    <Link to="/supervised/dishes/new">
                        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                            + Add Dish
                        </button>
                    </Link>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Category</p>
                        <div className="inline-flex flex-wrap border border-gray-300 rounded-md overflow-hidden">
                            {categories.map((cat, idx) => {
                                const isFirst = idx === 0;
                                const isLast = idx === categories.length - 1;

                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategorySelect(cat.id)}
                                        className={`px-4 py-2 text-sm font-medium transition 
                                            ${selectedCategory === cat.id
                                                ? "bg-primary text-white"
                                                : "bg-white text-gray-800 hover:bg-gray-100"
                                            }
                                            ${!isLast ? "border-r border-gray-300" : ""}
                                            ${isFirst ? "rounded-l-md" : ""}
                                            ${isLast ? "rounded-r-md" : ""}`}
                                    >
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Dietary Filter</p>
                        <select
                            value={selectedFilter}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="w-full sm:w-[180px] px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Dishes</option>
                            <option value="halal">Halal Only</option>
                            <option value="kosher">Kosher Only</option>
                            <option value="noNuts">Nut-Free</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <p className="text-gray-500 text-sm">Loading dishes...</p>
                ) : dishes.length === 0 ? (
                    <div className="text-center py-10 text-gray-600">
                        <p className="text-base font-medium">
                            No dishes found in the <span className="capitalize">{selectedCategory}</span> category.
                        </p>
                        <p className="text-sm mt-1 text-gray-400">Try a different category or remove filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {dishes.map((dish) => (
                            <AdminDishCard
                                key={dish._id}
                                item={dish}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                 onToggleAvailability={handleToggleAvailability}
                            />
                        ))}
                    </div>
                )}
            </main>

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-lg p-6 shadow-xl w-[90%] max-w-sm">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Delete Dish?</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Are you sure you want to delete <strong>{dishToDelete?.name}</strong>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDishToDelete(null);
                                }}
                                className="px-4 py-1 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DishesByCategory;
