import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/customer/Home';
import Menu from './pages/customer/Menu';
function App() {
  return (
    <div>
     <Router>
      <div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
