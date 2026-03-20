import { useState, useEffect } from "react";
import api from "../api/axios";
import { Gift, Coins } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-6 shadow-lg mb-6">
        <h1 className="text-2xl font-bold mb-4">Rewards</h1>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 flex justify-between items-center">
          <div>
            <p className="text-white/80 text-sm">Your Points</p>
            <p className="text-3xl font-bold">{wallet}</p>
          </div>
          <Coins size={40} className="text-white/80" />
        </div>
      </div>

      <div className="px-4 pb-24">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="text-violet-600" size={20} />
          <h2 className="font-semibold text-gray-800">Available Rewards</h2>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && rewards.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <p className="text-gray-400 text-sm">No rewards available</p>
          </div>
        )}

        {!loading && rewards.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {rewards.map((r) => (
              <button
                key={r._id}
                onClick={() => apply(r._id)}
                disabled={wallet < r.pointsRequired || applying === r._id}
                className="bg-white rounded-xl p-3 text-center border border-gray-200 hover:shadow-md transition disabled:opacity-60 flex flex-col items-center"
              >
                {r.rewardImage
                  ? <img src={r.rewardImage} alt={r.rewardName} className="w-12 h-12 object-cover rounded-lg mb-2" />
                  : <div className="text-3xl mb-2">🎁</div>
                }
                <p className="text-xs font-semibold text-gray-700 mb-1 w-full truncate text-center">{r.rewardName}</p>
                <p className="text-sm font-bold text-violet-600">{r.pointsRequired} pts</p>
                {applying === r._id
                  ? <span className="text-[10px] text-violet-500 mt-1 block">...</span>
                  : wallet >= r.pointsRequired
                    ? <span className="text-[10px] text-green-600 mt-1 block">Available</span>
                    : <span className="text-[10px] text-red-400 mt-1 block">Need {r.pointsRequired - wallet} more</span>
                }
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
