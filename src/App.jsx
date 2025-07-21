import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/customer/Home';
function App() {
  return (
    <div>
     <Router>
      <div>

        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
