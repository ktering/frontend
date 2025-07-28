import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/customer/Home';
import ChefProfile from './pages/customer/ChefProfile';
import Menu from './pages/customer/Menu';
import DishDetail from './pages/customer/DishDetail';
import Chefs from './pages/customer/AllChefs';
import AdminChefs from './pages/admin/AllChefs';
import Admin from './pages/admin/Home';
import AddDishForm from './pages/admin/AddDishForm';
<<<<<<< HEAD
import DishesByCategory from './pages/admin/DishesByCategory';
import DishesByChef from './pages/admin/DishesByChef';
import EditDishPage from './pages/admin/EditDishPage';
=======
import AddChefForm from './pages/admin/AddChefForm';
import EditChefForm from './pages/admin/EditChefForm';
import AdminChefProfile from './pages/admin/ChefProfile';
>>>>>>> 648f949618d5841bba0524c81a3987cbd3fc678c

function App() {
  return (
    <div>
      <Router>
        <div>
          <Routes>
            {/* customer */}
            <Route path="/" element={<Home />} />
            <Route path="/chefs/:chefId" element={<ChefProfile />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/chefs" element={<Chefs />} />
            <Route path="/dish/:slug" element={<DishDetail />} />
            {/* admin */}
            <Route path="/supervised" element={<Admin />} />
            <Route path="/supervised/chefs" element={<AdminChefs />} />
<<<<<<< HEAD
            <Route path="/supervised/dishes/category" element={<DishesByCategory />} />
            <Route path="/supervised/dishes/chef" element={<DishesByChef />} />
=======
            <Route path="/supervised/chefs/new" element={<AddChefForm />} />
            <Route path="/supervised/chefs/:id/edit" element={<EditChefForm />} />
            <Route path="/supervised/chefs/:chefId" element={<AdminChefProfile />} />
            <Route path="/supervised/dishes" element={<AllDishes />} />
>>>>>>> 648f949618d5841bba0524c81a3987cbd3fc678c
            <Route path="/supervised/dishes/new" element={<AddDishForm />} />
            <Route path="/supervised/dishes/edit/:id" element={<EditDishPage />} />

          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
