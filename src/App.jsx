import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ParkingProvider } from './context/ParkingContext';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import CityDashboard from './pages/CityDashboard';
import Login from './pages/Login';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ParkingProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/map" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<CityDashboard />} />
          </Routes>
        </ParkingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
