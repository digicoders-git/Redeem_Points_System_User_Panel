import { useState, useEffect } from "react";
import api from "../api/axios";
import { Info } from "lucide-react";

export default function Redemptions() {
  const [redemptions, setRedemptions] = useState([]);

  useEffect(() => {
    // populated field is "rewardId" not "reward"
    api.get("/rewards/user/my-redemptions").then(({ data }) =>
      setRedemptions(data.redemptions || [])
    );
  }, []);

  const statusStyle = {
    pending: "bg-amber-100 text-amber-600",
    approved: "bg-green-100 text-green-600",
    rejected: "bg-red-100 text-red-500",
  };

  return (
    <div className="px-4 py-6 pb-24">
      <h2 className="text-xl font-bold text-gray-800 mb-4">My Redemptions</h2>

      <div className="space-y-3">
        {redemptions.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">No redemptions yet</p>
        )}
        {redemptions.map((r) => (
          <div key={r._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3 flex justify-between items-center">
            <div>
              {/* populated as rewardId */}
              <p className="font-semibold text-gray-800">{r.rewardId?.rewardName || "Reward"}</p>
              <p className="text-xs text-gray-400 mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
              {r.rejectionReason && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><Info size={14} /> {r.rejectionReason}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyle[r.status]}`}>
                {r.status}
              </span>
              <span className="text-xs text-red-400 font-semibold">-{r.pointsUsed} pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
