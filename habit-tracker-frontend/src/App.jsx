import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomePage   from "./pages/HomePage";
import LoginPage  from "./pages/LoginPage";
import Dashboard  from "./pages/Dashboard";
import HabitsPage from "./pages/HabitsPage";
import StreakPage  from "./pages/StreakPage";
import GrowthPage  from "./pages/GrowthPage";
import PointsPage  from "./pages/PointsPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F5EE]">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl animate-bounce">🎯</span>
          <p className="text-[#9A8670] font-semibold text-sm tracking-wide">Loading Stiq...</p>
        </div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"          element={<HomePage />} />
      <Route path="/login"     element={<PublicRoute><LoginPage  /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard  /></ProtectedRoute>} />
      <Route path="/habits"    element={<ProtectedRoute><HabitsPage /></ProtectedRoute>} />
      <Route path="/stats"     element={<ProtectedRoute><StreakPage  /></ProtectedRoute>} />
      <Route path="/rewards"   element={<ProtectedRoute><GrowthPage  /></ProtectedRoute>} />
      <Route path="/points"    element={<ProtectedRoute><PointsPage  /></ProtectedRoute>} />
      <Route path="*"          element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}