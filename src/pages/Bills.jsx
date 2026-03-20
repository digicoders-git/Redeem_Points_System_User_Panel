import { useState, useEffect } from "react";
import api from "../api/axios";
import { Camera, Info, Gift, Award, ChevronRight, Coins } from "lucide-react";
import Swal from "sweetalert2";

export default function Bills({ onNavigate }) {
  const [bills, setBills] = useState([]);
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingBills, setLoadingBills] = useState(true);
  const [userPoints, setUserPoints] = useState(0);
  const [userName, setUserName] = useState("");
  const [rewards, setRewards] = useState([]);
  const [applying, setApplying] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);

  const loadProfile = () =>
    api.get("/users/profile").then(({ data }) => {
      setUserPoints(data.user.walletPoints || 0);
      setUserName(data.user.name || "");
    });

  const load = () =>
    api.get("/bills/my-bills")
      .then(({ data }) => setBills(data.bills || []))
      .finally(() => setLoadingBills(false));

  useEffect(() => {
    loadProfile();
    load();
    api.get("/rewards/user/all").then(({ data }) => setRewards(data.rewards || []));
  }, []);

  const applyReward = async (rewardId) => {
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
      loadProfile();
    } catch (e) {
      Swal.fire({ icon: "error", title: "Failed", text: e.response?.data?.message || "Failed to apply" });
    } finally {
      setApplying(null);
    }
  };

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("billFile", file);
      fd.append("amount", amount);
      await api.post("/bills/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      Swal.fire({ icon: "success", title: "Bill Uploaded!", text: "Bill uploaded successfully!", timer: 1500, showConfirmButton: false });
      setAmount("");
      setFile(null);
      e.target.reset();
      load();
      loadProfile();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Upload Failed", text: err.response?.data?.message || "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  const statusStyle = {
    pending: "bg-amber-100 text-amber-600",
    approved: "bg-green-100 text-green-600",
    rejected: "bg-red-100 text-red-500",
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 pt-6 pb-8 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Cable Sansar</h1>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">Partner</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs mb-0.5">Welcome back,</p>
            <p className="text-xl font-bold">{userName ? `${userName} 👋` : "👋"}</p>
          </div>
          <div className="bg-white/15 border border-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl flex items-center gap-3">
            <Coins size={22} className="text-yellow-300" />
            <div>
              <p className="text-[11px] text-white/70 leading-none mb-1">Your Points</p>
              <p className="text-2xl font-extrabold leading-none">{userPoints}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 pb-24">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="text-violet-600" size={20} />
            <h3 className="font-semibold text-gray-800">Upload Purchase Slip</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">Upload your purchase slip to earn points!</p>

          <form onSubmit={upload} className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="text-sm text-gray-600 mb-2 block">Total Amount Spent</label>
              <input
                type="number"
                placeholder="Enter amount in INR"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              />
            </div>

            <label className="flex items-center gap-3 border-2 border-dashed border-gray-300 rounded-xl px-4 py-4 cursor-pointer hover:border-violet-400 transition bg-gray-50">
              <span className="text-violet-600"><Camera size={24} /></span>
              <div className="flex-1">
                <span className="text-sm text-gray-600 block">{file ? file.name : "Upload purchase slip"}</span>
                <span className="text-xs text-gray-400">Supports: JPG, PNG, PDF</span>
              </div>
              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setFile(e.target.files[0])} required />
            </label>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-60 shadow-md"
            >
              {uploading ? "Uploading..." : "Submit to earn points"}
            </button>
          </form>
        </div>

        {/* Redeem Section */}
        {rewards.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gift className="text-violet-600" size={20} />
                <h3 className="font-semibold text-gray-800">Redeem Your Points</h3>
              </div>
              <button onClick={() => onNavigate("rewards")} className="text-sm text-violet-600 flex items-center gap-1">
                View All <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {rewards.map((r) => (
                <button
                  key={r._id}
                  onClick={() => applyReward(r._id)}
                  disabled={userPoints < r.pointsRequired || applying === r._id}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 text-center border border-gray-200 hover:shadow-md transition disabled:opacity-60"
                >
                  {r.rewardImage
                    ? <img src={r.rewardImage} alt={r.rewardName} className="w-10 h-10 object-cover rounded-lg mx-auto mb-2" />
                    : <div className="text-3xl mb-2">🎁</div>
                  }
                  <p className="text-xs font-semibold text-gray-700 mb-1 truncate">{r.rewardName}</p>
                  <p className="text-sm font-bold text-violet-600">{r.pointsRequired} pts</p>
                  {applying === r._id
                    ? <span className="text-[10px] text-violet-500 mt-1 block">...</span>
                    : userPoints >= r.pointsRequired
                      ? <span className="text-[10px] text-green-600 mt-1 block">Available</span>
                      : <span className="text-[10px] text-red-400 mt-1 block">Need {r.pointsRequired - userPoints} more</span>
                  }
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bills History */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Award size={18} className="text-violet-600" />
            Bills
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {loadingBills && (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {!loadingBills && bills.length === 0 && (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                <p className="text-gray-400 text-sm">No bills uploaded yet</p>
                <p className="text-xs text-gray-300 mt-1">Upload your first bill to earn points!</p>
              </div>
            )}
            {bills.map((b) => (
              <button
                key={b._id}
                onClick={() => setSelectedBill(b)}
                className="bg-white rounded-xl p-3 text-center border border-gray-200 hover:shadow-md transition flex flex-col items-center"
              >
                <div className="text-3xl mb-2">🧾</div>
                <p className="text-sm font-bold text-gray-800 mb-1">₹{b.amount}</p>
                <p className="text-xs text-gray-400 mb-1">{new Date(b.createdAt).toLocaleDateString()}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${statusStyle[b.status]}`}>
                  {b.status}
                </span>
                {b.pointsEarned > 0 && (
                  <span className="text-[10px] text-violet-600 font-semibold mt-1">+{b.pointsEarned} pts</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bill Detail Modal */}
        {selectedBill && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4" onClick={() => setSelectedBill(null)}>
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 text-lg">Bill Details</h3>
                <button onClick={() => setSelectedBill(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 font-bold">✕</button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto px-6 py-4 space-y-3 flex-1">
                <div className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-500">Amount</span>
                  <span className="font-bold text-gray-800 text-lg">₹{selectedBill.amount}</span>
                </div>

                <div className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusStyle[selectedBill.status]}`}>
                    {selectedBill.status}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-500">Points Earned</span>
                  <span className="font-semibold text-violet-600">{selectedBill.pointsEarned > 0 ? `+${selectedBill.pointsEarned} pts` : "—"}</span>
                </div>

                <div className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-500">Uploaded On</span>
                  <span className="text-sm font-medium text-gray-700">{new Date(selectedBill.createdAt).toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-500">Last Updated</span>
                  <span className="text-sm font-medium text-gray-700">{new Date(selectedBill.updatedAt).toLocaleString()}</span>
                </div>

                {selectedBill.rejectionReason && (
                  <div className="bg-red-50 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-500 mb-1">Rejection Reason</p>
                    <p className="text-sm text-red-500 font-medium">{selectedBill.rejectionReason}</p>
                  </div>
                )}
              </div>

              {/* Fixed Bottom Button */}
              <div className="px-6 pb-6 pt-3 border-t border-gray-100">
                {selectedBill.billImage ? (
                  <a
                    href={selectedBill.billImage}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3 rounded-xl text-sm"
                  >
                    View Uploaded File
                  </a>
                ) : (
                  <button
                    onClick={() => setSelectedBill(null)}
                    className="w-full border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
