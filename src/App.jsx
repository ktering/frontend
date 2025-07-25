import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/customer/Home';
import ChefProfile from './pages/customer/ChefProfile';
import Menu from './pages/customer/Menu';
import DishDetail from './pages/customer/DishDetail';
function App() {
  return (
    <div>
     <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* add id here for chef once backend works */}
          <Route path="/chefs/:chefId" element={<ChefProfile />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/dish/:slug" element={<DishDetail />} />
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
