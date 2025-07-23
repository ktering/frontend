import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/customer/Home';
import ChefProfile from './pages/customer/ChefProfile';
function App() {
  return (
    <div>
     <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* add id here for chef once backend works */}
          <Route path="/chef" element={<ChefProfile />} />
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
