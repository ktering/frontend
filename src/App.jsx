import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//customer imports
import Home from './pages/customer/Home';
import ChefProfile from './pages/customer/ChefProfile';
import Menu from './pages/customer/Menu';
import DishDetail from './pages/customer/DishDetail';
import Chefs from './pages/customer/AllChefs';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Success from './pages/customer/Success';
import Cancel from './pages/customer/Cancel';
//admin imports
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminChefs from './pages/admin/AllChefs';
import Admin from './pages/admin/Home';
import AddDishForm from './pages/admin/AddDishForm';
import DishesByCategory from './pages/admin/DishesByCategory';
import DishesByChef from './pages/admin/DishesByChef';
import EditDishPage from './pages/admin/EditDishPage';
import AddChefForm from './pages/admin/AddChefForm';
import EditChefForm from './pages/admin/EditChefForm';
import AdminChefProfile from './pages/admin/ChefProfile';
import AdminLogin from './pages/admin/AdminLogin';
import OrdersAdmin from './pages/admin/Orders';
import DishPage from './pages/admin/DishPage';
// Chef imports
import ChefProtectedRoute from './components/chef/ProtectedRoute';
import Login from './pages/chef/Login';
import ChefDashboard from './pages/chef/ChefDashboard';
import ChefOrders from './pages/chef/Orders';
import ChefDishes from './pages/chef/ChefDishes';
import ChefEarnings from './pages/chef/Earnings';
// Driver imports
import DriverLogin from './pages/driver/DriverLogin';
import DriverDashboard from './pages/driver/Orders';//orders for mvp later we can have a proper driver dashboard
import DeliveryCamera from './pages/driver/DeliveryCamera';

function MaintenanceBanner() {
  return (
    <div style={{
      backgroundColor: "#fef3c7",
      color: "#92400e",
      textAlign: "center",
      padding: "10px",
      fontWeight: "bold",
      borderBottom: "2px solid #fcd34d",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      🚧 Scheduled Maintenance: Some features may not work properly. Will be back soon.
    </div>
  );
}

function App() {
  return (
    <div>

       {/* Banner always visible */}
      <MaintenanceBanner />
      <Router>
        <div>
          <Routes>
            {/* customer */}
            <Route path="/" element={<Home />} />
            <Route path="/chefs/:chefId" element={<ChefProfile />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/chefs" element={<Chefs />} />
            <Route path="/dish/:slug" element={<DishDetail />} />
            <Route
              path="/cart"
              element={<Cart />}
              />
            <Route
              path="/checkout"
              element={<Checkout />}
              />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />

            {/* chef */}
            <Route path="/chef/login" element={<Login />} />
            <Route
              path="/chef-dashboard"  element={<ChefProtectedRoute><ChefDashboard/></ChefProtectedRoute>}/>
              
            <Route
              path="/chef-orders"  element={<ChefProtectedRoute><ChefOrders/></ChefProtectedRoute>}/>
            <Route
              path="/chef-dishes"  element={<ChefProtectedRoute><ChefDishes/></ChefProtectedRoute>}/>
            <Route
              path="/chef-earnings"  element={<ChefProtectedRoute><ChefEarnings/></ChefProtectedRoute>}/>

            {/* admin */}
            <Route path="/supervised/login" element={<AdminLogin />} />
            <Route
              path="/supervised/"
              element={<ProtectedRoute><Admin /></ProtectedRoute>}
            />
            <Route
              path="/supervised/chefs"
              element={<ProtectedRoute><AdminChefs /></ProtectedRoute>}
            />
            <Route
            path='supervised/dishes/:slug'
            element={<ProtectedRoute><DishPage /></ProtectedRoute>} 
            />
            <Route
              path="/supervised/dishes/category"
              element={<ProtectedRoute><DishesByCategory /></ProtectedRoute>}
            />
            <Route
              path="/supervised/dishes/chef"
              element={<ProtectedRoute><DishesByChef /></ProtectedRoute>}
            />
            <Route
              path="/supervised/chefs/new"
              element={<ProtectedRoute><AddChefForm /></ProtectedRoute>}
            />
            <Route
              path="/supervised/chefs/:id/edit"
              element={<ProtectedRoute><EditChefForm /></ProtectedRoute>}
            />
            <Route
              path="/supervised/chefs/:chefId"
              element={<ProtectedRoute><AdminChefProfile /></ProtectedRoute>}
            />
            <Route
              path="/supervised/dishes/new"
              element={<ProtectedRoute><AddDishForm /></ProtectedRoute>}
            />
            <Route
              path="/supervised/dishes/edit/:id"
              element={<ProtectedRoute><EditDishPage /></ProtectedRoute>}
            />
            <Route
              path="/supervised/orders"
              element={<ProtectedRoute><OrdersAdmin /></ProtectedRoute>}
            />
            <Route path="/driver/login" element={<DriverLogin />} />
            <Route path="/driver" element={<DriverDashboard />} />
            <Route path="/driver/delivery-camera" element={<DeliveryCamera />} />

            {/* Fallback route */}
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;