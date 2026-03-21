import { useState, useEffect } from "react";
import api from "../api/axios";
import { CopyCheck, Info, Loader2, Gift, ArrowLeft } from "lucide-react";

export default function Redemptions() {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRedemption, setSelectedRedemption] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  useEffect(() => {
    api.get("/rewards/user/my-redemptions")
      .then(({ data }) => setRedemptions(data.redemptions || []))
      .finally(() => setLoading(false));
  }, []);

  const statusStyle = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    approved: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-600 border-red-200",
    delivered: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans pb-24">
      {/* Top Header Background */}
      <div className="bg-[#0f4089] rounded-b-[40px] px-6 pt-10 pb-12 mb-6 relative overflow-hidden shadow-lg">
        {/* Abstract Background Waves */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-sm border border-white/20">
            <CopyCheck className="text-white" size={24} />
          </div>
          <h1 className="text-white font-bold text-2xl tracking-wide">My Redemptions</h1>
        </div>
      </div>

      <div className="px-5">
        <div className="space-y-4">
          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
          )}
          
          {!loading && redemptions.length === 0 && (
            <div className="bg-white rounded-[24px] p-10 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <CopyCheck size={28} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No redemptions yet</p>
            </div>
          )}
          
          {redemptions.map((r) => (
            <button 
              key={r._id} 
              onClick={() => setSelectedRedemption(r)}
              className="w-full text-left bg-white rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 p-5 flex justify-between items-center transition hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex-1">
                {/* populated as rewardId */}
                <p className="font-bold text-gray-900 text-[15px] mb-0.5">{r.rewardId?.rewardName || "Reward"}</p>
                <p className="text-[12px] font-medium text-gray-400 mb-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                {r.rejectionReason && (
                  <p className="text-[11px] text-red-500/90 font-semibold mt-2 flex items-center gap-1.5 bg-red-50 p-2 rounded-lg border border-red-100">
                    <Info size={14} /> {r.rejectionReason}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 pl-4 border-l border-gray-50 ml-2">
                <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full capitalize border ${statusStyle[r.status]}`}>
                  {r.status}
                </span>
                <span className="text-[13px] text-[#f97316] font-extrabold bg-[#f97316]/10 px-2 py-0.5 rounded-lg">-{r.pointsUsed} pts</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Gift Full View Modal */}
      {selectedRedemption && (
        <div className="fixed inset-0 bg-white z-[60] flex flex-col animate-in slide-in-from-bottom-4 duration-200">
          {/* Modal Header */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 bg-white">
            <button 
              onClick={() => setSelectedRedemption(null)} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-colors text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="font-bold text-lg text-gray-800 flex-1">Redemption Details</h2>
          </div>

          <div className="flex-1 overflow-y-auto pb-24">
            {/* BIG Image Area */}
            <div className="w-full bg-gray-50 p-8 flex items-center justify-center aspect-square max-h-[40vh]">
              {selectedRedemption.rewardId?.rewardImage ? (
                <img 
                  src={selectedRedemption.rewardId.rewardImage} 
                  alt={selectedRedemption.rewardId.rewardName} 
                  className="w-full h-full object-contain drop-shadow-lg cursor-zoom-in active:scale-95 transition-transform" 
                  onClick={() => setFullScreenImage(selectedRedemption.rewardId.rewardImage)}
                />
              ) : (
                <Gift size={80} className="text-[#1a4187]/30" />
              )}
            </div>

            {/* Details Content */}
            <div className="px-5 pt-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedRedemption.rewardId?.rewardName || "Reward"}</h1>
              
              <div className="flex items-center gap-2 mb-6 mt-1">
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full capitalize border ${statusStyle[selectedRedemption.status]}`}>
                  {selectedRedemption.status}
                </span>
                <span className="text-sm font-medium text-gray-400">
                  {new Date(selectedRedemption.createdAt).toLocaleDateString()}
                </span>
              </div>

              {selectedRedemption.rejectionReason && (
                <div className="bg-red-50 rounded-[16px] p-4 border border-red-100 mb-6">
                  <p className="text-[11px] font-bold text-red-500/80 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Info size={14} /> Rejection Reason
                  </p>
                  <p className="text-sm text-red-700 font-semibold">{selectedRedemption.rejectionReason}</p>
                </div>
              )}

              <div className="bg-[#F5F7FA] border border-gray-100 rounded-3xl p-5 flex justify-between items-center shadow-inner">
                <div>
                  <p className="text-[11px] text-gray-500 font-bold mb-1 uppercase tracking-wider">Points Used</p>
                  <p className="text-2xl font-extrabold text-[#f97316]">-{selectedRedemption.pointsUsed} <span className="text-sm font-medium text-gray-500">pts</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
