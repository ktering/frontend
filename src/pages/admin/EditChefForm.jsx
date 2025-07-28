import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChefForm from "../../components/admin/ChefForm";
import { getChefById } from "../../api/chef";

export default function EditChefForm() {
  const { id } = useParams();
  const [chefData, setChefData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChefById(id)
      .then((data) => {
        setChefData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!chefData) return <div className="p-10 text-center">Chef not found.</div>;

  return <ChefForm isEdit={true} initialData={chefData} />;
}
