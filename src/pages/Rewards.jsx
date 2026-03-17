import { useState, useEffect } from "react";
import api from "../api/axios";
import { Coins, Target } from "lucide-react";
import Swal from "sweetalert2";

export default function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [applying, setApplying] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/rewards/user/all"),
      api.get("/users/profile"),
    ]).then(([r, p]) => {
      setRewards(r.data.rewards || []);
      setWallet(p.data.user?.walletPoints || 0);
    }).finally(() => setLoading(false));
  }, []);

  const apply = async (rewardId) => {
    const result = await Swal.fire({
      title: "Redeem Reward?",
      text: "Are you sure you want to redeem this reward?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, Redeem!",
    });
    if (!result.isConfirmed) return;
    setApplying(rewardId);
    try {
      await api.post("/rewards/user/apply", { rewardId });
      Swal.fire({ icon: "success", title: "Redemption Submitted!", timer: 1500, showConfirmButton: false });
      const { data } = await api.get("/users/profile");
      setWallet(data.user?.walletPoints || 0);
    } catch (e) {
      Swal.fire({ icon: "error", title: "Failed", text: e.response?.data?.message || "Failed to apply" });
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

      <div className="space-y-3">
        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!loading && rewards.length === 0 && (
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
