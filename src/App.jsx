import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Bills from "./pages/Bills";
import Rewards from "./pages/Rewards";
import Redemptions from "./pages/Redemptions";
import BottomNav from "./components/BottomNav";
import { Download } from "lucide-react";

export default function App() {
  const token = localStorage.getItem("userToken");
  const [authMode, setAuthMode] = useState("login");
  const [tab, setTab] = useState("bills");
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstallPrompt(null);
  };

  if (!token) {
    return authMode === "login"
      ? <Login onSwitch={() => setAuthMode("register")} />
      : <Register onSwitch={() => setAuthMode("login")} />;
  }

  const pages = {
    bills: <Bills onNavigate={setTab} />,
    rewards: <Rewards />,
    redemptions: <Redemptions />,
    profile: <Profile />,
  };

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-gray-50 relative">
      {pages[tab]}
      <BottomNav active={tab} setActive={setTab} />
      {installPrompt && (
        <button
          onClick={handleInstall}
          className="fixed bottom-20 right-4 z-50 flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg transition"
        >
          <Download size={14} /> Install App
        </button>
      )}
    </div>
  );
}
