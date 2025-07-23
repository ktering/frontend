import { useEffect, useState } from "react";
import {
  fetchAllDishes,
  fetchDishesByCategory,
  fetchAllCategories,
} from "../../api/dish";

// Components
import DishList from "../../components/customer/Menu/DishList";
import SearchBar from "../../components/customer/Menu/SearchBar";
import CategorySection from "../../components/customer/home/CategorySection";
import Header from "../../components/customer/Header";

const Menu = () => {
  const [dishes, setDishes] = useState([]);
  const [allDishes, setAllDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Load all dishes initially
  useEffect(() => {
    loadAllDishes();
  }, []);

  const loadAllDishes = async () => {
    setLoading(true);
    const data = await fetchAllDishes();
    setDishes(data);
    setAllDishes(data);
    setLoading(false);
  };

  // Handle category click
  const handleCategorySelect = async (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setDishes(allDishes);
      return;
    }

    setLoading(true);
    const filtered = await fetchDishesByCategory(category);
    setDishes(filtered);
    setSelectedCategory(category);
    setLoading(false);
  };

  // Handle search filter
  const handleSearch = (text) => {
    setSearchTerm(text);
    if (!text) {
      setDishes(selectedCategory ? dishes : allDishes);
      return;
    }

    const filtered = (selectedCategory ? dishes : allDishes).filter((dish) =>
      dish.name.toLowerCase().includes(text.toLowerCase())
    );
    setDishes(filtered);
  };

  return (
    <>
    <Header/>
    <div className="px-4 py-6 max-w-7xl mx-auto font-nunito">
      <h1 className="text-2xl font-bold text-center mb-4 text-primary">
        Explore Our Delicious Menu
      </h1>

      {/* Search Bar */}
      {/* <SearchBar onSearch={handleSearch} /> */}

      {/* Category Filters */}
      <CategorySection onSelectCategory={handleCategorySelect} selected={selectedCategory} />

      {/* Dish List */}
      <DishList dishes={dishes} loading={loading} />
    </div>
    </>
  );
};

export default Menu;
