import { useEffect, useState } from "react";
import {
    fetchAllDishes,
    fetchDishesByCategory,
} from "../../api/dish";
import { Link } from "react-router-dom";

import Sidebar from "../../components/admin/Sidebar";
import AdminDishCard from "../../components/admin/AdminDishCard";

// Categories for admin filtering
const categories = [
    { id: "all", name: "All" },
    { id: "trending", name: "Trending" },
    { id: "asian", name: "Asian" },
    { id: "middle-eastern", name: "Middle Eastern" },
    { id: "vegetarian", name: "Vegetarian" },
    { id: "vegan", name: "Vegan" },
    { id: "desserts", name: "Desserts" },
];

const AllDishes = () => {
    const [dishes, setDishes] = useState([]);
    const [allDishes, setAllDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedFilter, setSelectedFilter] = useState("all");

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

    const handleEdit = (dish) => console.log("Edit:", dish);
    const handleDelete = (dish) => console.log("Delete:", dish);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <main className="flex-1 ml-64 p-8 font-nunito">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Manage Dishes</h1>
                    <Link to="/supervised/dishes/new">
                        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                            + Add Dish
                        </button>
                    </Link>

                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
                    {/* Category Buttons */}
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
            ${isLast ? "rounded-r-md" : ""}
          `}
                                    >
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>


                    {/* Dietary Filter Dropdown */}
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                            Dietary Filter
                        </p>
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

                {/* Dish Grid */}
                {loading ? (
                    <p className="text-gray-500 text-sm">Loading dishes...</p>
                ) : dishes.length === 0 ? (
                    <div className="text-center py-10 text-gray-600">
                        <p className="text-base font-medium">
                            No dishes found in the <span className="capitalize">{selectedCategory}</span> category at the moment.
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
                            />
                        ))}
                    </div>
                )}

            </main>
        </div>
    );
};

export default AllDishes;
