import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CustomerRegistration from './pages/CustomerRegistration';
import CustomerLogin from './pages/CustomerLogin';
import BankerLogin from './pages/BankerLogin';
import CustomerDashboard from './pages/CustomerDashboard';
import BankerDashboard from './pages/BankerDashboard';
import CustomerDetails from './pages/CustomerDetails';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<CustomerRegistration />} />
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/banker/login" element={<BankerLogin />} />
          <Route 
            path="/customer/dashboard" 
            element={
              <ProtectedRoute role="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/banker/dashboard" 
            element={
              <ProtectedRoute role="banker">
                <BankerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/banker/customers/:id" 
            element={
              <ProtectedRoute role="banker">
                <CustomerDetails />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;