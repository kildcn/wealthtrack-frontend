import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Main Application Pages
import Dashboard from './pages/dashboard/Dashboard';
import PortfolioList from './pages/portfolios/PortfolioList';
import PortfolioDetail from './pages/portfolios/PortfolioDetail';
import PortfolioForm from './pages/portfolios/PortfolioForm';
import SimulationList from './pages/simulations/SimulationList';
import SimulationDetail from './pages/simulations/SimulationDetail';
import SimulationForm from './pages/simulations/SimulationForm';
import UserProfile from './pages/profile/UserProfile';
import NotFound from './pages/NotFound';

// Layout Components
import MainLayout from './components/common/MainLayout';

// Private Route component
const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state if still checking authentication
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  // Redirect to login if not authenticated
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Private routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Portfolio routes */}
          <Route path="portfolios" element={<PortfolioList />} />
          <Route path="portfolios/new" element={<PortfolioForm />} />
          <Route path="portfolios/:id" element={<PortfolioDetail />} />
          <Route path="portfolios/:id/edit" element={<PortfolioForm />} />

          {/* Simulation routes */}
          <Route path="simulations" element={<SimulationList />} />
          <Route path="simulations/new" element={<SimulationForm />} />
          <Route path="simulations/:id" element={<SimulationDetail />} />

          {/* User profile */}
          <Route path="profile" element={<UserProfile />} />
        </Route>
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
