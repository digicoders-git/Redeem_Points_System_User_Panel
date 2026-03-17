import { useState, useEffect } from "react";
import api from "../api/axios";
import { Coins, LogOut } from "lucide-react";
import Swal from "sweetalert2";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/users/profile").then(({ data }) => {
      setProfile(data.user);
      setForm({ name: data.user.name, mobile: data.user.mobile });
    });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put("/users/profile", form);
      setProfile(data.user);
      setEdit(false);
      Swal.fire({ icon: "success", title: "Profile Updated!", timer: 1500, showConfirmButton: false });
    } catch (e) {
      Swal.fire({ icon: "error", title: "Update Failed", text: e.response?.data?.message || "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, Logout",
    });
    if (!result.isConfirmed) return;
    await api.post("/users/logout").catch(() => {});
    localStorage.clear();
    await Swal.fire({
      icon: "success",
      title: "Logged Out!",
      text: "You have been logged out successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
    window.location.reload();
  };

  if (!profile)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

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
            <button type="submit" disabled={saving} className="flex-1 bg-violet-600 text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-60">
              {saving ? <span className="flex justify-center"><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /></span> : "Save"}
            </button>
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
