import { useState, useEffect } from "react";
import api from "../api/axios";
import { Coins, LogOut } from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  // API update accepts: name, mobile
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/users/profile").then(({ data }) => {
      setProfile(data.user);
      setForm({ name: data.user.name, mobile: data.user.mobile });
    });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/users/profile", form);
      setProfile(data.user);
      setEdit(false);
      setMsg("Profile updated!");
      setTimeout(() => setMsg(""), 2000);
    } catch (e) {
      setMsg(e.response?.data?.message || "Update failed");
    }
  };

  const logout = async () => {
    await api.post("/users/logout").catch(() => {});
    localStorage.clear();
    window.location.reload();
  };

  if (!profile)
    return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="px-4 py-6 pb-24">
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-violet-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {profile.name?.[0]?.toUpperCase()}
        </div>
        <h2 className="text-xl font-bold text-gray-800 mt-3">{profile.name}</h2>
        <p className="text-gray-500 text-sm">{profile.email}</p>
        <div className="mt-3 bg-violet-100 text-violet-700 font-semibold px-5 py-2 rounded-full text-sm flex items-center gap-1.5">
          <Coins size={16} /> {profile.walletPoints || 0} Points
        </div>
      </div>

      {msg && (
        <div className="bg-green-50 text-green-600 text-sm text-center rounded-xl px-4 py-2 mb-4">{msg}</div>
      )}

      {edit ? (
        <form onSubmit={save} className="space-y-3">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          <input
            placeholder="Mobile"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-violet-600 text-white py-3 rounded-xl font-semibold text-sm">Save</button>
            <button type="button" onClick={() => setEdit(false)} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold text-sm">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          <div className="flex justify-between px-4 py-3 text-sm">
            <span className="text-gray-500">Mobile</span>
            <span className="font-medium text-gray-800">{profile.mobile}</span>
          </div>
          <div className="flex justify-between px-4 py-3 text-sm">
            <span className="text-gray-500">Status</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${profile.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
              {profile.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="px-4 py-3">
            <button onClick={() => setEdit(true)} className="w-full bg-violet-600 text-white py-2.5 rounded-xl text-sm font-semibold">
              Edit Profile
            </button>
          </div>
        </div>
      )}

      <button onClick={logout} className="mt-6 w-full border border-red-300 text-red-500 py-3 rounded-xl text-sm font-semibold hover:bg-red-50 transition flex justify-center items-center gap-2">
        <LogOut size={16} /> Logout
      </button>
    </div>
  );
}
