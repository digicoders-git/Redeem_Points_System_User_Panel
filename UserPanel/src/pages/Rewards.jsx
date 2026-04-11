import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Gift, Coins, Loader2 } from "lucide-react";

export default function Rewards() {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/rewards/user/all"), api.get("/users/profile")])
      .then(([r, p]) => { setRewards(r.data.rewards || []); setWallet(p.data.user?.walletPoints || 0); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans pb-24">
      <div className="bg-[#0f4089] rounded-b-[40px] px-6 pt-10 pb-10 mb-6 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <h1 className="text-white font-bold text-2xl tracking-wide mb-5">Rewards Gallery</h1>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl px-6 py-5 flex justify-between items-center">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1 uppercase tracking-wider">Your Points</p>
              <p className="text-4xl font-extrabold text-white">{wallet}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <Coins size={30} className="text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5">
        <div className="flex items-center gap-2 mb-5">
          <Gift className="text-[#1a4187]" size={22} />
          <h2 className="text-lg font-bold text-gray-800">Available Rewards</h2>
        </div>

        {loading && <div className="flex justify-center py-16"><Loader2 className="animate-spin text-slate-400" size={32} /></div>}

        {!loading && rewards.length === 0 && (
          <div className="bg-white rounded-[24px] p-10 text-center border border-gray-100 shadow-sm">
            <Gift size={28} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium pb-4">No rewards available yet</p>
          </div>
        )}

        {!loading && rewards.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {rewards.map((r) => {
              const images = r.rewardImages?.length > 0 ? r.rewardImages : r.rewardImage ? [r.rewardImage] : [];
              return (
                <button key={r._id} onClick={() => navigate(`/rewards/${r._id}`, { state: { reward: r } })} className="bg-white rounded-[24px] p-4 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center group relative overflow-hidden active:scale-[0.98]">
                  <div className="w-full aspect-square flex items-center justify-center p-2 mb-4 bg-gray-50 rounded-2xl overflow-hidden relative">
                    {images.length > 0 ? (
                      <img src={images[0]} alt={r.rewardName} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" onError={(e) => { e.target.style.display = "none"; }} />
                    ) : (
                      <Gift size={40} className="text-[#1a4187]/30" />
                    )}
                    {images.length > 1 && <span className="absolute bottom-1.5 right-1.5 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{images.length} pics</span>}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-800 mb-1 w-full truncate">{r.rewardName}</h3>
                  <p className="text-[15px] font-extrabold text-[#0f4089]">{r.pointsRequired} <span className="text-xs font-medium text-gray-400">pts</span></p>
                  {wallet < r.pointsRequired && <div className="absolute top-3 right-3 bg-red-100 w-2.5 h-2.5 rounded-full ring-2 ring-white" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
