import './styles/globals.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LandingPage from './landing/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/builder" element={
          <div className="w-full h-screen overflow-hidden">
            <Dashboard />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;