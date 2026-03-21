import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ConfigureDashboard from './pages/ConfigureDashboard';
import OrdersPage from './pages/OrdersPage';
import InsightsPage from './pages/InsightsPage';
import ProfilePage from './pages/ProfilePage';
import TimeMachinePage from './pages/TimeMachinePage';

// Enforce theme based on current route
function ThemeEnforcer() {
  const location = useLocation();
  const { enforceThemeForRoute } = useTheme();
  useEffect(() => {
    enforceThemeForRoute(location.pathname);
  }, [location.pathname]);
  return null;
}

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/app/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DashboardProvider>
          <BrowserRouter>
            <ThemeEnforcer />
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'font-sans text-sm',
                style: { borderRadius: '12px', border: '1px solid #e4e4e7', background: '#fff', color: '#18181b' },
              }}
            />
            <Routes>
              {/* Always-light public pages */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

              {/* Protected app (supports dark mode) */}
              <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="configure" element={<ConfigureDashboard />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="insights" element={<InsightsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="time-machine" element={<TimeMachinePage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </DashboardProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
