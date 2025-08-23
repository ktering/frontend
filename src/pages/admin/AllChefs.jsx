import React, { useEffect, useState } from "react";
import { getAllChefs,deleteChef } from "../../api/chef";
import ChefsGrid from "../../components/shared/chefGrid";
import Sidebar from "../../components/admin/Sidebar";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";

export default function AdminChefsPage() {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllChefs()
      .then(setChefs)
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (chef) => {
    navigate(`/supervised/chefs/${chef._id}/edit`);
  };

  const handleDelete = async (chef) => {
  if (window.confirm(`Are you sure you want to delete ${chef.name}?`)) {
    try {
      await deleteChef(chef._id);
      setChefs((prevChefs) => prevChefs.filter((c) => c._id !== chef._id));
    } catch (err) {
      alert("Error deleting Kterer: " + err.message);
    }
  }
};

  return (
    <AdminLayout>

      {/* Main Content */}
      <main className="">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Kterers</h1>
          <button onClick={() => navigate("/supervised/chefs/new")} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            + Add Kterer
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading Kterer...</div>
        ) : chefs.length === 0 ? (
          <div className="text-center text-gray-400">No Kterer found.</div>
        ) : (
          <ChefsGrid
            chefs={chefs}
            onChefClick={(chef) => navigate(`/supervised/chefs/${chef._id}`)}
            renderActions={(chef) => (
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(chef);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(chef);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          />
        )}
      </main>
    </AdminLayout>
  );
}
