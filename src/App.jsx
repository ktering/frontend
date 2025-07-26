import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/customer/Home';
import ChefProfile from './pages/customer/ChefProfile';
import Menu from './pages/customer/Menu';
import DishDetail from './pages/customer/DishDetail';
import Chefs from './pages/customer/AllChefs';
import AdminChefs from './pages/admin/AllChefs';
import Admin from './pages/admin/Home';
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
          
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
