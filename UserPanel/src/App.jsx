import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Bills from "./pages/Bills";
import Rewards from "./pages/Rewards";
import Redemptions from "./pages/Redemptions";
import BottomNav from "./components/BottomNav";

export default function App() {
  const token = localStorage.getItem("userToken");
  const [authMode, setAuthMode] = useState("login");
  const [tab, setTab] = useState("bills");

  if (!token) {
    return authMode === "login"
      ? <Login onSwitch={() => setAuthMode("register")} />
      : <Register onSwitch={() => setAuthMode("login")} />;
  }

  const pages = {
    bills: <Bills />,
    rewards: <Rewards />,
    redemptions: <Redemptions />,
    profile: <Profile />,
  };

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-gray-50 relative">
      {pages[tab]}
      <BottomNav active={tab} setActive={setTab} />
    </div>
  );
}
