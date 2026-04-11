import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Gift, Coins, Loader2 } from "lucide-react";
import api from "../api/axios";
import Swal from "sweetalert2";

export default function RewardDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const r = state?.reward;
  const [activeImg, setActiveImg] = useState(0);
  const [fullScreen, setFullScreen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [wallet, setWallet] = useState(0);
  const [walletLoading, setWalletLoading] = useState(true);

  useEffect(() => {
    api.get("/users/profile").then(({ data }) => {
      setWallet(data.user?.walletPoints || 0);
    }).finally(() => setWalletLoading(false));
  }, []);

  if (!r) { navigate("/rewards", { replace: true }); return null; }

  const images = r.rewardImages?.length > 0 ? r.rewardImages : r.rewardImage ? [r.rewardImage] : [];

  const apply = async () => {
    const res = await Swal.fire({ title: "Redeem Reward?", text: "Are you sure?", icon: "question", showCancelButton: true, confirmButtonColor: "#0f4089", confirmButtonText: "Yes, Redeem!" });
    if (!res.isConfirmed) return;
    setApplying(true);
    try {
      await api.post("/rewards/user/apply", { rewardId: r._id });
      const { data } = await api.get("/users/profile");
      setWallet(data.user.walletPoints || 0);
      Swal.fire({ icon: "success", title: "Redemption Submitted!", timer: 1500, showConfirmButton: false });
      navigate(-1);
    } catch (e) {
      Swal.fire({ icon: "error", title: "Failed", text: e.response?.data?.message || "Failed to apply" });
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-bold text-lg text-gray-800">Gift Details</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-28">
        <div className="w-full bg-gray-50 flex items-center justify-center aspect-square max-h-[42vh] relative overflow-hidden">
          {images.length > 0 ? (
            <>
              <img src={images[activeImg]} alt={r.rewardName} className="w-full h-full object-contain p-6 cursor-zoom-in active:scale-95 transition-transform" onClick={() => setFullScreen(true)} onError={(e) => { e.target.style.display = "none"; }} />
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImg((activeImg - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg">‹</button>
                  <button onClick={() => setActiveImg((activeImg + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg">›</button>
                </>
              )}
            </>
          ) : (
            <Gift size={80} className="text-gray-200" />
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100 overflow-x-auto no-scrollbar">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${i === activeImg ? "border-[#0f4089] scale-105" : "border-gray-200 opacity-60"}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="px-5 pt-5">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{r.rewardName}</h1>
          <p className="text-gray-500 text-sm mb-5 leading-relaxed">{r.description || "Redeem this exciting gift by spending your earned points!"}</p>
          <div className="bg-[#F5F7FA] border border-gray-100 rounded-2xl p-5 flex justify-between items-center mb-4">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Required</p>
              <p className="text-3xl font-extrabold text-[#0f4089]">{r.pointsRequired} <span className="text-sm font-medium text-gray-500">pts</span></p>
            </div>
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
              <Coins size={28} className="text-yellow-400" />
            </div>
          </div>
          <div className="flex justify-between items-center px-1 py-3 border-t border-gray-100">
            <span className="text-sm text-gray-500 font-medium">Your Balance</span>
            <span className="font-bold text-gray-800 text-lg">{wallet} pts</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe">
        {walletLoading ? (
          <button disabled className="w-full bg-gray-100 text-gray-400 font-bold py-4 rounded-2xl flex justify-center items-center gap-2">
            <Loader2 size={20} className="animate-spin" /> Checking balance...
          </button>
        ) : wallet >= r.pointsRequired ? (
          <button onClick={apply} disabled={applying} className="w-full bg-[#f97316] text-white font-bold py-4 rounded-2xl flex justify-center items-center gap-2 active:scale-[0.98] transition shadow-lg disabled:opacity-60">
            {applying ? <><Loader2 size={20} className="animate-spin" /> Processing...</> : <><Gift size={20} /> Redeem Now</>}
          </button>
        ) : (
          <button disabled className="w-full bg-red-50 text-red-500 font-bold py-4 rounded-2xl flex justify-center items-center gap-2 border border-red-100">
            Need {r.pointsRequired - wallet} more points
          </button>
        )}
      </div>

      {fullScreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setFullScreen(false)}>
          <img src={images[activeImg]} alt="Full" className="w-full h-full object-contain" />
          <button className="absolute top-6 left-6 bg-white/10 p-3 rounded-full text-white" onClick={() => setFullScreen(false)}>
            <ArrowLeft size={22} />
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}` }} />
    </div>
  );
}
