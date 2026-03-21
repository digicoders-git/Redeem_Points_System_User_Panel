import { useState, useEffect } from "react";
import api from "../api/axios";
import { CopyCheck, Info, Loader2 } from "lucide-react";

export default function Redemptions() {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/rewards/user/my-redemptions")
      .then(({ data }) => setRedemptions(data.redemptions || []))
      .finally(() => setLoading(false));
  }, []);

  const statusStyle = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    approved: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-600 border-red-200",
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
            <div key={r._id} className="bg-white rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 p-5 flex justify-between items-center transition hover:shadow-md">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
