import { useState, useEffect } from "react";
import api from "../api/axios";
import { Coins, Target } from "lucide-react";

export default function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [applying, setApplying] = useState(null);
  const [msg, setMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    api.get("/rewards/user/all").then(({ data }) => setRewards(data.rewards || []));
    api.get("/users/profile").then(({ data }) => setWallet(data.user?.walletPoints || 0));
  }, []);

  const apply = async (rewardId) => {
    setApplying(rewardId);
    setMsg({ text: "", type: "" });
    try {
      await api.post("/rewards/user/apply", { rewardId });
      setMsg({ text: "Redemption request submitted!", type: "success" });
      const { data } = await api.get("/users/profile");
      setWallet(data.user?.walletPoints || 0);
    } catch (e) {
      setMsg({ text: e.response?.data?.message || "Failed to apply", type: "error" });
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="px-4 py-6 pb-24">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-4 mb-5 flex justify-between items-center text-white shadow-lg">
        <div>
          <p className="text-sm opacity-80">Your Wallet</p>
          <p className="text-3xl font-bold">{wallet}</p>
          <p className="text-xs opacity-70">Points Available</p>
        </div>
        <div className="text-white opacity-80"><Coins size={48} /></div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Available Rewards</h2>

      {msg.text && (
        <div className={`text-sm rounded-xl px-4 py-2 mb-4 text-center ${msg.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
          {msg.text}
        </div>
      )}

      <div className="space-y-3">
        {rewards.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">No rewards available</p>
        )}
        {rewards.map((r) => (
          <div key={r._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {r.rewardImage && (
              <img src={r.rewardImage} alt={r.rewardName} className="w-full h-36 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-bold text-gray-800">{r.rewardName}</h3>
              {r.description && <p className="text-sm text-gray-500 mt-1">{r.description}</p>}
              <div className="flex justify-between items-center mt-3">
                <span className="text-violet-600 font-semibold text-sm flex items-center gap-1"><Target size={14} /> {r.pointsRequired} pts</span>
                <button
                  onClick={() => apply(r._id)}
                  disabled={wallet < r.pointsRequired || applying === r._id}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    wallet >= r.pointsRequired
                      ? "bg-violet-600 text-white hover:bg-violet-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {applying === r._id ? "..." : "Redeem"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
