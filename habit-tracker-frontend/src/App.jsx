import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout      from "./components/Layout";
import HomePage    from "./pages/HomePage";
import LoginPage   from "./pages/LoginPage";
import Dashboard   from "./pages/Dashboard";
import HabitsPage  from "./pages/HabitsPage";
import StreakPage   from "./pages/StreakPage";
import GrowthPage  from "./pages/GrowthPage";
import PointsPage  from "./pages/PointsPage";

// ── Loading screen ────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F5EE]">
      <div className="flex flex-col items-center gap-3">
        <span className="text-4xl animate-bounce">🎯</span>
        <p className="text-[#9A8670] font-semibold text-sm tracking-wide">Loading Stiq...</p>
      </div>
    </div>
  );
}

// ── Protected route — shows Layout + page, or redirects to /login ─────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

// ── Public route — redirects to /dashboard if already logged in ───────────────
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

// ── Routes ────────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

      {/* Protected — all wrapped in Layout automatically */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard  /></ProtectedRoute>} />
      <Route path="/habits"    element={<ProtectedRoute><HabitsPage /></ProtectedRoute>} />
      <Route path="/stats"     element={<ProtectedRoute><StreakPage  /></ProtectedRoute>} />
      <Route path="/rewards"   element={<ProtectedRoute><GrowthPage  /></ProtectedRoute>} />
      <Route path="/points"    element={<ProtectedRoute><PointsPage  /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
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