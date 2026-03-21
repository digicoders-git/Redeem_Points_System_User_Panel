import { useState, useEffect } from "react";
import api from "../api/axios";
import { Camera, Gift, ChevronRight, User, Plus, Search, HelpCircle, FileText, ArrowLeft, Loader2, Coins } from "lucide-react";
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
  const [selectedReward, setSelectedReward] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);

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
      setSelectedReward(null);
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
    <div className="min-h-screen bg-[#F5F7FA] font-sans pb-24">
      {/* Top Header Background */}
      <div className="bg-[#0f4089] rounded-b-[40px] px-6 pt-12 pb-24 relative overflow-hidden">
        {/* Abstract Background Waves */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl shadow-md flex justify-center items-center">
              <span className="text-[#0f4089] font-extrabold text-xl">C</span>
              <span className="w-2 h-2 bg-[#f97316] rounded-full absolute ml-4 mt-4"></span>
            </div>
            <h1 className="text-white font-bold text-lg tracking-wide">Cable Sansar Partner App</h1>
          </div>
          <div 
            onClick={() => onNavigate("profile")}
            className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <User className="text-[#0f4089]" size={24} />
          </div>
        </div>
      </div>

      <div className="px-5 -mt-14 relative z-20">

        {/* Welcome & Points Card */}
        <div className="bg-white rounded-3xl p-6 flex justify-between items-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] mb-6 border border-gray-100 relative overflow-hidden">
          {/* Decorative faint circles on right */}
          <div className="absolute right-[-20px] top-[-20px] w-32 h-32 border-4 border-[#F0F4FF] rounded-full opacity-50 pointer-events-none"></div>
          <div className="absolute right-10 top-10 w-16 h-16 border-[3px] border-[#F0F4FF] rounded-full opacity-60 pointer-events-none"></div>

          <div className="z-10">
            <p className="text-gray-500 font-medium text-[15px] mb-1">Welcome, {userName || "Partner"}!</p>
            <h2 className="text-[#0f4089] text-[26px] font-bold">Your Points: {userPoints}</h2>
          </div>

          <div className="w-16 h-16 bg-[#184F9E] rounded-full flex justify-center items-center shadow-lg shadow-blue-900/20 relative z-10">
            <div className="relative">
              <FileText className="text-white" size={26} strokeWidth={2} />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-md w-4 h-4 flex items-center justify-center">
                <Plus size={12} className="text-[#184F9E] font-bold" />
              </div>
            </div>
          </div>
        </div>

        {/* Upload Bill & Amount Form */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] mb-8 border border-gray-100 flex flex-col gap-5">
          <div className="flex gap-4 items-center">
            {/* Phone Illustration */}
            <div className="w-[70px] h-[90px] bg-[#E3EBFB] rounded-2xl p-[6px] relative shadow-inner flex-shrink-0">
              <div className="w-full h-full bg-white rounded-xl flex flex-col items-center justify-center border-2 border-[#184F9E] shadow-sm relative overflow-hidden">
                <div className="w-6 h-1 bg-gray-200 rounded-full mt-1 mb-2 absolute top-1"></div>
                <div className="w-6 h-6 rounded bg-[#FBEED7] flex items-center justify-center mt-2 text-[#f97316] font-bold text-sm">C</div>
                <div className="w-8 h-1 bg-gray-100 mt-2 rounded"></div>
                <div className="w-6 h-1 bg-gray-100 mt-1 rounded"></div>

                {/* Plus Badge */}
                <div className="absolute -right-2 -bottom-2 w-6 h-6 bg-[#f97316] text-white rounded-full border-2 border-white flex items-center justify-center translate-x-[-12px] translate-y-[-10px] shadow-sm">
                  <Plus size={14} strokeWidth={4} />
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Upload Purchase</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed max-w-[180px]">
                Earn points for your bills!
              </p>
            </div>
          </div>

          <form onSubmit={upload} className="flex flex-col gap-4">
            <div className="border-2 border-dashed border-[#f97316]/30 bg-[#f97316]/5 rounded-xl hover:bg-[#f97316]/10 transition relative">
              <label className="cursor-pointer w-full h-full flex items-center justify-center py-3 px-4 min-h-[50px]">
                {file ? (
                  <span className="text-[#f97316] font-bold text-[14px] truncate px-2">{file.name}</span>
                ) : (
                  <span className="text-[#f97316] font-bold text-[14px]">Select Purchase Slip</span>
                )}
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
              </label>
            </div>

            <div className="relative">
              <input
                type="number"
                placeholder="Total Amount Spent"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full border-2 border-gray-100 rounded-[16px] px-5 py-3.5 text-[15px] font-medium text-gray-800 focus:outline-none focus:border-[#f97316]/50 bg-white shadow-inner pr-14"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8c9fba] font-bold text-sm">
                INR
              </span>
            </div>

            <button
              type="submit"
              disabled={uploading || !file || !amount}
              className="w-full bg-[#f97316] hover:bg-[#eb6a10] active:bg-[#db620c] text-white font-bold text-[16px] py-[14px] rounded-[16px] shadow-[0_5px_15px_rgba(249,115,22,0.3)] transition-all disabled:opacity-50 disabled:shadow-none"
            >
              {uploading ? "Submitting..." : "Submit to earn points"}
            </button>
          </form>
        </div>

        {/* Redeem Your Points Section */}
        {rewards.length > 0 && (
          <div className="mb-8">
            <h3 className="text-[#0f4089] text-xl font-bold mb-4 px-1">Redeem Your Points</h3>

            <div className="flex overflow-x-auto gap-4 pb-4 -mx-1 px-1 snap-x no-scrollbar">
              {rewards.map((r) => (
                <button
                  key={r._id}
                  onClick={() => setSelectedReward(r)}
                  className="bg-white rounded-[20px] p-4 min-w-[170px] border border-gray-100 shadow-[0_4px_15px_rgb(0,0,0,0.03)] flex flex-col items-center flex-shrink-0 snap-start active:scale-[0.98] transition-all"
                >
                  <div className="w-36 h-36 bg-gray-50 flex items-center justify-center rounded-xl mb-3 overflow-hidden">
                    {r.rewardImage ? (
                      <img src={r.rewardImage} alt={r.rewardName} className="w-full h-full object-contain" />
                    ) : (
                      <Gift className="text-gray-300" size={60} />
                    )}
                  </div>
                  <h4 className="text-[14px] font-bold text-gray-800 mb-1 w-full truncate text-center">{r.rewardName}</h4>
                  <p className="text-[14px] font-bold">
                    <span className="text-red-500">{r.pointsRequired}</span> <span className="text-gray-400 text-xs">Points</span>
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-2 flex justify-center">
              <button
                onClick={() => onNavigate("rewards")}
                className="bg-[#1a4187] hover:bg-[#123168] text-white text-sm font-bold py-3 px-8 rounded-full shadow-md transition-colors w-[180px]"
              >
                View All Gifts
              </button>
            </div>
          </div>
        )}

        {/* Bills History */}
        <div className="mt-4 pt-6 border-t border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 px-1 flex items-center gap-2">
            <FileText size={18} className="text-[#1a4187]" />
            Recent Bills
          </h3>

          <div className="space-y-3">
            {loadingBills && (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin text-slate-400" />
              </div>
            )}
            {!loadingBills && bills.length === 0 && (
              <div className="bg-white rounded-[16px] p-6 text-center border border-gray-100 shadow-sm">
                <p className="text-gray-400 text-sm">No bills uploaded yet</p>
              </div>
            )}
            {bills.map((b) => (
              <button
                key={b._id}
                onClick={() => setSelectedBill(b)}
                className="w-full bg-white rounded-[16px] p-4 border border-gray-100 shadow-sm hover:shadow-md transition flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl text-gray-500 font-bold">₹</div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-800">₹{b.amount}</p>
                    <p className="text-[11px] text-gray-400">{new Date(b.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${statusStyle[b.status]}`}>
                    {b.status}
                  </span>
                  {b.pointsEarned > 0 && (
                    <span className="text-[11px] text-[#0f4089] font-bold">+{b.pointsEarned} pts</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bill Detail Modal */}
        {selectedBill && (
          <div className="fixed inset-0 bg-white z-[60] flex flex-col animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 bg-white">
              <button
                onClick={() => setSelectedBill(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-colors text-gray-600"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="font-bold text-lg text-gray-800 flex-1">Bill Details</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pb-28 space-y-4 bg-[#F5F7FA]">
              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Amount</span>
                <span className="font-extrabold text-gray-900 text-xl">₹{selectedBill.amount}</span>
              </div>

              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Status</span>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${statusStyle[selectedBill.status]}`}>
                  {selectedBill.status}
                </span>
              </div>

              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Points Earned</span>
                <span className="font-bold text-green-600 text-lg">
                  {selectedBill.pointsEarned > 0 ? `+${selectedBill.pointsEarned} pts` : "—"}
                </span>
              </div>

              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Date</span>
                <span className="text-sm font-semibold text-gray-700">
                  {new Date(selectedBill.createdAt).toLocaleDateString()}
                </span>
              </div>

              {selectedBill.rejectionReason && (
                <div className="bg-red-50/50 rounded-[20px] p-5 border border-red-100">
                  <p className="text-xs text-red-500/70 font-bold mb-1 uppercase tracking-wider">Rejection Reason</p>
                  <p className="text-sm text-red-600 font-semibold leading-relaxed">{selectedBill.rejectionReason}</p>
                </div>
              )}

              {selectedBill.billImage && (
                <div className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">Bill Image</p>
                  <img
                    src={selectedBill.billImage}
                    alt="Bill"
                    className="w-full h-48 rounded-xl object-cover cursor-zoom-in active:scale-95 transition-transform"
                    onClick={() => setFullScreenImage(selectedBill.billImage)}
                  />
                </div>
              )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
              {selectedBill.billImage ? (
                  <a
                    href={selectedBill.billImage}
                    className="flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl shadow-sm transition-colors"
                  >
                    Download Original Base ↗
                  </a>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-100 text-gray-400 font-bold py-4 rounded-xl cursor-not-allowed"
                >
                  No Attachment Available
                </button>
              )}
            </div>
          </div>
        )}

        {/* Gift Full View Modal */}
        {selectedReward && (
          <div className="fixed inset-0 bg-white z-[60] flex flex-col animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 bg-white">
              <button
                onClick={() => setSelectedReward(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-colors text-gray-600"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="font-bold text-lg text-gray-800 flex-1">Gift Details</h2>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
              <div className="w-full bg-gray-50 p-8 flex items-center justify-center aspect-square max-h-[40vh]">
                {selectedReward.rewardImage ? (
                  <img
                    src={selectedReward.rewardImage}
                    alt={selectedReward.rewardName}
                    className="w-full h-full object-contain drop-shadow-lg cursor-zoom-in active:scale-95 transition-transform"
                    onClick={() => setFullScreenImage(selectedReward.rewardImage)}
                  />
                ) : (
                  <Gift size={80} className="text-violet-300" />
                )}
              </div>

              <div className="px-5 pt-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedReward.rewardName}</h1>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  {selectedReward.description || "Redeem this exciting gift by spending your earned points!"}
                </p>

                <div className="bg-[#F5F7FA] border border-gray-100 rounded-2xl p-4 flex justify-between items-center mb-6 shadow-inner">
                  <div>
                    <p className="text-[11px] text-gray-500 font-bold mb-1 uppercase tracking-wider">Required</p>
                    <p className="text-2xl font-extrabold text-[#0f4089]">{selectedReward.pointsRequired} <span className="text-sm font-medium text-gray-500">pts</span></p>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Coins size={24} className="text-yellow-400" />
                  </div>
                </div>

                <div className="flex justify-between items-center px-2 py-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">Your Current Balance</span>
                  <span className="font-bold text-gray-800">{userPoints} pts</span>
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe">
              {userPoints >= selectedReward.pointsRequired ? (
                <button
                  onClick={() => applyReward(selectedReward._id)}
                  disabled={applying === selectedReward._id}
                  className="w-full bg-gradient-to-r from-[#0f4089] to-[#1a4187] active:scale-[0.98] text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex justify-center items-center gap-2"
                >
                  {applying === selectedReward._id ? (
                    <><Loader2 size={20} className="animate-spin" /> Processing...</>
                  ) : (
                    <><Gift size={20} /> Redeem Now</>
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-red-50 text-red-500 font-bold py-4 rounded-2xl flex justify-center items-center gap-2 border border-red-100"
                >
                  Need {selectedReward.pointsRequired - userPoints} more points
                </button>
              )}
            </div>
          </div>
        )}
      </div>

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
            className="absolute top-6 right-6 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); setFullScreenImage(null); }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Required for no-scrollbar utility to hide scrollbar but maintain functionality */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
