import { useNavigate } from "react-router-dom";
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";
import { getAllChefs } from "../../api/chef";
import ChefsGrid from "../../components/shared/chefGrid";
import React, { useEffect, useState } from "react";

export default function AllChefs() {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllChefs()
      .then(setChefs)
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
    <Header />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-primary text-center">
          Meet Our Kterers
        </h1>
        {loading ? (
          <div className="text-center text-gray-500 py-20">
            Loading Kterers...
          </div>
        ) : chefs.length === 0 ? (
          <div className="text-center text-gray-400">No Kterer found.</div>
        ) : (
          <ChefsGrid
            chefs={chefs}
            onChefClick={(chef) => navigate(`/chefs/${chef._id}`)}
          />
        )}
      </div>
      <Footer />
    </>
  );
}
