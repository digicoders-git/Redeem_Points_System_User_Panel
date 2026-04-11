import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bills from "./pages/Bills";
import Rewards from "./pages/Rewards";
import Redemptions from "./pages/Redemptions";
import Profile from "./pages/Profile";
import BillDetail from "./pages/BillDetail";
import RewardDetail from "./pages/RewardDetail";
import RedemptionDetail from "./pages/RedemptionDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import BottomNav from "./components/BottomNav";
import PullToRefresh from "./components/PullToRefresh";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("userToken");
  return token ? children : <Navigate to="/login" replace />;
}

const BOTTOM_NAV_ROUTES = ["/bills", "/rewards", "/redemptions", "/profile"];

export default function App() {
  const location = useLocation();
  const showNav = BOTTOM_NAV_ROUTES.includes(location.pathname);

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); window.__installPrompt = e; };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => { window.__installPrompt = null; });
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  return (
    <PullToRefresh>
      <div className="max-w-lg mx-auto min-h-screen bg-[#F5F7FA] font-sans relative pb-safe">
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main tabs */}
          <Route path="/bills" element={<ProtectedRoute><Bills /></ProtectedRoute>} />
          <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
          <Route path="/redemptions" element={<ProtectedRoute><Redemptions /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Detail pages */}
          <Route path="/bills/:id" element={<ProtectedRoute><BillDetail /></ProtectedRoute>} />
          <Route path="/rewards/:id" element={<ProtectedRoute><RewardDetail /></ProtectedRoute>} />
          <Route path="/redemptions/:id" element={<ProtectedRoute><RedemptionDetail /></ProtectedRoute>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* Default */}
          <Route path="/" element={<Navigate to="/bills" replace />} />
          <Route path="*" element={<Navigate to="/bills" replace />} />
        </Routes>

        {showNav && <BottomNav />}
      </div>
    </PullToRefresh>
  );
}
