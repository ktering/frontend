import React, { useEffect, useState } from "react";
import { getAllChefs } from "../../api/chef";
import ChefsGrid from "../../components/shared/chefGrid";
import Sidebar from "../../components/admin/Sidebar";

export default function AdminChefsPage() {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllChefs()
      .then(setChefs)
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (chef) => {
    alert(`Edit ${chef.name}`);
  };

  const handleDelete = (chef) => {
    alert(`Delete ${chef.name}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Chefs</h1>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            + Add Chef
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading chefs...</div>
        ) : chefs.length === 0 ? (
          <div className="text-center text-gray-400">No chefs found.</div>
        ) : (
          <ChefsGrid
            chefs={chefs}
            onChefClick={handleEdit}
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
    </div>
  );
}
