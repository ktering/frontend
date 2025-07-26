import React, { useEffect, useState } from "react";
import { getAllChefs } from "../../api/chef";
import ChefsGrid from "../../components/shared/chefGrid";

export default function AdminChefsPage() {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllChefs()
      .then(setChefs)
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (chef) => {
    // Open edit dialog or navigate to edit page
    alert(`Edit ${chef.name}`);
  };

  const handleDelete = (chef) => {
    // Confirm and delete logic
    alert(`Delete ${chef.name}`);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-8">Manage Chefs</h1>
      {loading ? (
        <div className="text-center text-gray-500 py-20">Loading chefs...</div>
      ) : chefs.length === 0 ? (
        <div className="text-center text-gray-400">No chefs found.</div>
      ) : (
        <ChefsGrid
          chefs={chefs}
          onChefClick={(chef) => handleEdit(chef)}
          renderActions={(chef) => (
            <div className="flex gap-2 mt-4">
              <button
                className="bg-primary/80 text-white px-3 py-1 rounded text-xs hover:bg-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(chef);
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500/80 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
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
    </div>
  );
}
