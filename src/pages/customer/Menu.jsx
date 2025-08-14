import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchAllDishes, fetchDishesByCategory } from "../../api/dish";
import DishList from "../../components/customer/Menu/DishList";
import CategorySection from "../../components/customer/home/CategorySection";
import Header from "../../components/customer/Header";

const ITEMS_PER_PAGE = 12;

const Menu = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromQuery = queryParams.get("category") || "all";

  const [dishes, setDishes] = useState([]);
  const [allDishes, setAllDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromQuery);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(dishes.length / ITEMS_PER_PAGE);
  const currentDishes = dishes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    loadAllDishes();
  }, []);

  useEffect(() => {
    if (allDishes.length > 0) {
      handleCategorySelect(categoryFromQuery);
    }
  }, [categoryFromQuery, allDishes]);

  const loadAllDishes = async () => {
    setLoading(true);
    const data = await fetchAllDishes();
    setAllDishes(data);
    setDishes(data);
    setLoading(false);
  };

  const handleCategorySelect = async (categoryId) => {
    let filteredCategoryDishes = [];

    if (!categoryId || categoryId === "all") {
      filteredCategoryDishes = allDishes;
      setSelectedCategory("all");
    } else {
      setLoading(true);
      filteredCategoryDishes = await fetchDishesByCategory(categoryId);
      setSelectedCategory(categoryId);
      setLoading(false);
    }

    applyFilter(selectedFilter, filteredCategoryDishes);
    setCurrentPage(1);
  };

  const applyFilter = (filterValue, baseDishes) => {
    let filtered = [...baseDishes];

    switch (filterValue) {
      case "noNuts":
        filtered = filtered.filter((dish) => !dish.containsNuts);
        break;
      case "halal":
        filtered = filtered.filter((dish) => dish.halal);
        break;
      case "kosher":
        filtered = filtered.filter((dish) => dish.kosher);
        break;
      default:
        break;
    }

    setDishes(filtered);
  };

  const handleFilterChange = (value) => {
    setSelectedFilter(value);

    const base =
      selectedCategory === "all"
        ? allDishes
        : allDishes.filter((dish) => dish.category === selectedCategory);

    applyFilter(value, base);
    setCurrentPage(1);
  };

  return (
    <>
      <Header />
      <div className="px-4 py-6 max-w-7xl mx-auto font-nunito">
        {/* Heading + Filter Dropdown */}
        <div className="w-[80%] mx-auto flex flex-row flex-wrap justify-between items-center gap-3 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-primary whitespace-nowrap">
            Menu
          </h1>

          <div className="relative w-full max-w-[140px] sm:max-w-[200px] sm:w-auto">
            <select
              value={selectedFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="text-sm w-full appearance-none px-4 pr-10 py-2 rounded-full border border-primary/40 bg-white text-gray-800 shadow-sm hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="all">All Dishes</option>
              <option value="noNuts">Nut-Free</option>
              <option value="halal">Halal Only</option>
              <option value="kosher">Kosher Only</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <CategorySection selected={selectedCategory} />

        {/* Dish List */}
        <DishList dishes={currentDishes} loading={loading} />

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-1 flex-wrap">
            {/* Prev */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`w-9 h-9 flex items-center justify-center rounded-full border text-sm font-medium transition-colors duration-200 ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-primary hover:text-white hover:border-primary"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Smart Pagination */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 5) return true;
                if (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(currentPage - page) <= 1
                )
                  return true;
                return false;
              })
              .map((page, idx, arr) => {
                const showDots = idx > 0 && page - arr[idx - 1] > 1;
                return (
                  <div key={page} className="flex items-center">
                    {showDots && (
                      <span className="px-2 text-gray-500 select-none">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 flex items-center justify-center rounded-full border text-sm font-medium transition-colors duration-200 ${
                        page === currentPage
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-primary hover:text-white hover:border-primary"
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                );
              })}

            {/* Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={`w-9 h-9 flex items-center justify-center rounded-full border text-sm font-medium transition-colors duration-200 ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-primary hover:text-white hover:border-primary"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Menu;
