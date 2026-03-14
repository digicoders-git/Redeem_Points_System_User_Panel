import { useState, useEffect } from "react";
import api from "../api/axios";
import { Camera, Info } from "lucide-react";

export default function Bills() {
  const [bills, setBills] = useState([]);
  // API required fields: billName, billNumber, billImage, date, amount
  const [form, setForm] = useState({ billName: "", billNumber: "", date: "", amount: "" });
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const load = () =>
    api.get("/bills/my-bills").then(({ data }) => setBills(data.bills || []));

  useEffect(() => { load(); }, []);

  const toBase64 = (file) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });

  const upload = async (e) => {
    e.preventDefault();
    if (!image) return;
    setUploading(true);
    setMsg({ text: "", type: "" });
    try {
      const billImage = await toBase64(image);
      await api.post("/bills/upload", {
        billName: form.billName,
        billNumber: form.billNumber,
        date: form.date,
        amount: Number(form.amount),
        billImage,
      });
      setMsg({ text: "Bill uploaded successfully!", type: "success" });
      setForm({ billName: "", billNumber: "", date: "", amount: "" });
      setImage(null);
      e.target.reset();
      load();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || "Upload failed", type: "error" });
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
    <div className="px-4 py-6 pb-24">
      <h2 className="text-xl font-bold text-gray-800 mb-4">My Bills</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
        <h3 className="font-semibold text-gray-700 mb-3">Upload New Bill</h3>
        {msg.text && (
          <div className={`text-sm rounded-xl px-4 py-2 mb-3 text-center ${msg.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
            {msg.text}
          </div>
        )}
        <form onSubmit={upload} className="space-y-3">
          <input
            placeholder="Bill Name"
            value={form.billName}
            onChange={(e) => setForm({ ...form, billName: e.target.value })}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          <input
            placeholder="Bill Number"
            value={form.billNumber}
            onChange={(e) => setForm({ ...form, billNumber: e.target.value })}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          <input
            type="number"
            placeholder="Bill Amount (₹)"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-xl px-4 py-3 cursor-pointer hover:border-violet-400 transition">
            <span className="text-slate-400"><Camera size={24} /></span>
            <span className="text-sm text-gray-500">{image ? image.name : "Choose bill image"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files[0])} required />
          </label>
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload Bill"}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {bills.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">No bills uploaded yet</p>
        )}
        {bills.map((b) => (
          <div key={b._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3 flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800">₹{b.amount}</p>
              <p className="text-xs text-gray-500">{b.billName} • #{b.billNumber}</p>
              <p className="text-xs text-gray-400 mt-0.5">{new Date(b.date || b.createdAt).toLocaleDateString()}</p>
              {b.rejectionReason && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><Info size={14} /> {b.rejectionReason}</p>}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyle[b.status]}`}>
                {b.status}
              </span>
              {b.pointsEarned > 0 && (
                <span className="text-xs text-violet-600 font-semibold">+{b.pointsEarned} pts</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
