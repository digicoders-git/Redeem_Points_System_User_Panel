import { useState, useEffect } from "react";
import api from "../api/axios";
import { Gift, Coins, ArrowLeft, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [applying, setApplying] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get("/rewards/user/all"),
      api.get("/users/profile"),
    ]).then(([r, p]) => {
      setRewards(r.data.rewards || []);
      setWallet(p.data.user?.walletPoints || 0);
    }).finally(() => setLoading(false));
  }, []);

  const openReward = (r) => {
    setSelectedReward(r);
    setActiveImageIndex(0);
  };
    api.get("/users/profile").then(({ data }) => setWallet(data.user?.walletPoints || 0));

  const apply = async (rewardId) => {
    const result = await Swal.fire({
      title: "Redeem Reward?",
      text: "Are you sure you want to redeem this reward?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1a4187",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, Redeem!",
    });
    if (!result.isConfirmed) return;
    setApplying(rewardId);
    try {
      await api.post("/rewards/user/apply", { rewardId });
      Swal.fire({ icon: "success", title: "Redemption Submitted!", timer: 1500, showConfirmButton: false });
      loadProfile();
      setSelectedReward(null); // Close modal on success
    } catch (e) {
      Swal.fire({ icon: "error", title: "Failed", text: e.response?.data?.message || "Failed to apply" });
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans pb-24">
      {/* Top Header Background */}
      <div className="bg-[#0f4089] rounded-b-[40px] px-6 pt-10 pb-10 mb-6 relative overflow-hidden shadow-lg">
        {/* Abstract Background Waves */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <h1 className="text-white font-bold text-2xl tracking-wide mb-5">Rewards Gallery</h1>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl px-6 py-5 flex justify-between items-center shadow-inner">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1 uppercase tracking-wider">Your Points</p>
              <p className="text-4xl font-extrabold text-white">{wallet}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center shadow-lg">
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

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-slate-400" size={32} />
          </div>
        )}

        {!loading && rewards.length === 0 && (
          <div className="bg-white rounded-[24px] p-10 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Gift size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium pb-4">No rewards available yet</p>
          </div>
        )}

        {!loading && rewards.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {rewards.map((r) => {
              const images = r.rewardImages?.length > 0 ? r.rewardImages : r.rewardImage ? [r.rewardImage] : [];
              return (
                <button
                  key={r._id}
                  onClick={() => openReward(r)}
                  className="bg-white rounded-[24px] p-4 text-center border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all flex flex-col items-center group relative overflow-hidden active:scale-[0.98]"
                >
                  <div className="w-full aspect-square flex items-center justify-center p-2 mb-4 bg-gray-50 rounded-2xl overflow-hidden relative">
                    {images.length > 0 ? (
                      <img src={images[0]} alt={r.rewardName} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <Gift size={40} className="text-[#1a4187]/30" />
                    )}
                    {images.length > 1 && (
                      <span className="absolute bottom-1.5 right-1.5 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{images.length} pics</span>
                    )}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-800 mb-1 w-full truncate">{r.rewardName}</h3>
                  <p className="text-[15px] font-extrabold text-[#0f4089] flex items-center justify-center gap-1">
                    {r.pointsRequired} <span className="text-xs font-medium text-gray-400">pts</span>
                  </p>
                  {wallet < r.pointsRequired && (
                    <div className="absolute top-3 right-3 bg-red-100 text-red-600 w-2.5 h-2.5 rounded-full ring-2 ring-white" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Gift Full View Modal */}
      {selectedReward && (() => {
        const images = selectedReward.rewardImages?.length > 0 ? selectedReward.rewardImages : selectedReward.rewardImage ? [selectedReward.rewardImage] : [];
        return (
          <div className="fixed inset-0 bg-white z-[60] flex flex-col animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 bg-white">
              <button onClick={() => setSelectedReward(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-colors text-gray-600">
                <ArrowLeft size={20} />
              </button>
              <h2 className="font-bold text-lg text-gray-800 flex-1">Gift Details</h2>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
              {/* Image Gallery */}
              <div className="w-full bg-gray-50 flex items-center justify-center aspect-square max-h-[42vh] relative overflow-hidden">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[activeImageIndex]}
                      alt={selectedReward.rewardName}
                      className="w-full h-full object-contain p-6 drop-shadow-lg cursor-zoom-in active:scale-95 transition-transform"
                      onClick={() => setFullScreenImage(images[activeImageIndex])}
                    />
                    {/* Prev/Next arrows */}
                    {images.length > 1 && (
                      <>
                        <button onClick={() => setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white w-8 h-8 rounded-full flex items-center justify-center transition">
                          ‹
                        </button>
                        <button onClick={() => setActiveImageIndex((activeImageIndex + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white w-8 h-8 rounded-full flex items-center justify-center transition">
                          ›
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <Gift size={80} className="text-[#1a4187]/30" />
                )}
              </div>

              {/* Thumbnail strip + dots */}
              {images.length > 1 && (
                <div className="flex gap-2 justify-center px-4 py-3 bg-gray-50 border-b border-gray-100 overflow-x-auto no-scrollbar">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImageIndex(i)} className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${i === activeImageIndex ? "border-[#0f4089] scale-105" : "border-gray-200 opacity-60"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="px-5 pt-5">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedReward.rewardName}</h1>
                <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                  {selectedReward.description || "Redeem this exciting gift by spending your earned points!"}
                </p>

                <div className="bg-[#F5F7FA] border border-gray-100 rounded-3xl p-5 flex justify-between items-center mb-5 shadow-inner">
                  <div>
                    <p className="text-[11px] text-gray-500 font-bold mb-1 uppercase tracking-wider">Required</p>
                    <p className="text-3xl font-extrabold text-[#0f4089]">{selectedReward.pointsRequired} <span className="text-sm font-medium text-gray-500">pts</span></p>
                  </div>
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Coins size={28} className="text-yellow-400" />
                  </div>
                </div>

                <div className="flex justify-between items-center px-2 py-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">Your Current Balance</span>
                  <span className="font-bold text-gray-800 text-lg">{wallet} pts</span>
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
              {wallet >= selectedReward.pointsRequired ? (
                <button onClick={() => apply(selectedReward._id)} disabled={applying === selectedReward._id} className="w-full bg-[#f97316] hover:bg-[#eb6a10] active:scale-[0.98] text-white font-bold py-4 rounded-[16px] shadow-[0_5px_15px_rgba(249,115,22,0.3)] transition-all flex justify-center items-center gap-2">
                  {applying === selectedReward._id ? <><Loader2 size={20} className="animate-spin" /> Processing...</> : <><Gift size={20} /> Redeem Now</>}
                </button>
              ) : (
                <button disabled className="w-full bg-red-50 text-red-500 font-bold py-4 rounded-[16px] flex justify-center items-center gap-2 border border-red-100">
                  Need {selectedReward.pointsRequired - wallet} more points
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* Full Screen Image Modal */}
      {fullScreenImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setFullScreenImage(null)}
        >
          <img 
            src={fullScreenImage} 
            alt="Full Screen" 
            className="w-full h-full object-contain max-w-full max-h-full"
          />
          <button 
            className="absolute top-6 left-6 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setFullScreenImage(null); }}
          >
            <ArrowLeft size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
