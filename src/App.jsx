import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ParkingProvider } from './context/ParkingContext';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <ParkingProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </ParkingProvider>
    </Router>
  );
}

export default App;
