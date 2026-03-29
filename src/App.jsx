import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Bills from "./pages/Bills";
import Rewards from "./pages/Rewards";
import Redemptions from "./pages/Redemptions";
import BottomNav from "./components/BottomNav";
import PullToRefresh from "./components/PullToRefresh";

export default function App() {
  const token = localStorage.getItem("userToken");
  const [authMode, setAuthMode] = useState("login");
  const [tab, setTab] = useState(() => localStorage.getItem("userTab") || "bills");

  const handleTab = (t) => { localStorage.setItem("userTab", t); setTab(t); };

  // Capture install prompt globally for Android — Profile page will use window.__installPrompt
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); window.__installPrompt = e; };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => { window.__installPrompt = null; });
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!token) {
    return authMode === "login"
      ? <Login onSwitch={() => setAuthMode("register")} />
      : <Register onSwitch={() => setAuthMode("login")} />;
  }

  const pages = {
    bills: <Bills onNavigate={handleTab} />,
    rewards: <Rewards />,
    redemptions: <Redemptions />,
    profile: <Profile />,
  };

  return (
    <PullToRefresh>
      <div className="max-w-lg mx-auto min-h-screen bg-[#F5F7FA] font-sans relative pb-safe">
        {pages[tab]}
        <BottomNav active={tab} setActive={handleTab} />
      </div>
    </PullToRefresh>
  );
}
