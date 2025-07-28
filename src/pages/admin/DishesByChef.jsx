import { useEffect, useState } from "react";
import { getAllChefs } from "../../api/chef";
import { getDishesByChef } from "../../api/dish";
import { Link } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import AdminDishCard from "../../components/admin/AdminDishCard";
import { deleteDishAdmin } from "../../api/admin";

const DishesByChef = () => {
    const [chefs, setChefs] = useState([]);
    const [selectedChef, setSelectedChef] = useState(null);
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dishToDelete, setDishToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = (dish) => {
        setDishToDelete(dish);
        setShowDeleteModal(true);
    };
    const confirmDelete = async () => {
        if (!dishToDelete) return;

        try {
            await deleteDishAdmin(dishToDelete._id);
            setDishes((prev) => prev.filter((d) => d._id !== dishToDelete._id));
        } catch (err) {
            console.error("Failed to delete dish:", err.message);
        } finally {
            setShowDeleteModal(false);
            setDishToDelete(null);
        }
    };

    useEffect(() => {
        const loadChefs = async () => {
            const data = await getAllChefs();
            setChefs(data);
        };
        loadChefs();
    }, []);

    const handleChefSelect = async (chef) => {
        setSelectedChef(chef);
        setLoading(true);
        try {
            const result = await getDishesByChef(chef._id);
            setDishes(result);
        } catch (err) {
            setDishes([]);
        }
        setLoading(false);
    };

    const handleEdit = (dish) => {
        navigate(`/supervised/dishes/edit/${dish._id}`);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <main className="flex-1 ml-64 p-8 font-nunito">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Manage Dishes by Chef</h1>
                </div>

                {/* Chef Selector */}
                <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Select a Chef</p>
                    <div className="flex flex-wrap gap-3">
                        {chefs.map((chef) => (
                            <button
                                key={chef._id}
                                onClick={() => handleChefSelect(chef)}
                                className={`px-4 py-2 text-sm rounded-md border transition font-medium ${selectedChef?._id === chef._id
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                                    }`}
                            >
                                {chef.name}
                            </button>
                        ))}
                    </div>
                </div>

                {selectedChef && (
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-700 text-sm font-medium">
                            Dishes by: <span className="font-semibold">{selectedChef.name}</span>
                        </p>
                        <Link to={`/supervised/dishes/new?chefId=${selectedChef._id}`}>
                            <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm">
                                + Add Dish for {selectedChef.name}
                            </button>
                        </Link>
                    </div>
                )}

                {/* Dish Grid */}
                {loading ? (
                    <p className="text-gray-500 text-sm">Loading dishes...</p>
                ) : dishes.length === 0 && selectedChef ? (
                    <div className="text-center py-10 text-gray-600">
                        <p className="text-base font-medium">
                            No dishes found for <span className="font-semibold">{selectedChef.name}</span>.
                        </p>
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

export default DishesByChef;
