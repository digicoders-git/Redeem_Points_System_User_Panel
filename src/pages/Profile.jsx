import { useState, useEffect } from "react";
import api from "../api/axios";
import { Coins, LogOut, Loader2, User, Camera } from "lucide-react";
import Swal from "sweetalert2";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/users/profile").then(({ data }) => {
      setProfile(data.user);
      setForm({
        name: data.user.name,
        mobile: data.user.mobile,
        profilePhoto: data.user.profilePhoto || "",
      });
    });
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({ icon: "error", title: "File too large", text: "Image must be under 2MB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, profilePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

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
      confirmButtonColor: "#e63946",
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
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans pb-24">
      {/* Top Header Background */}
      <div className="bg-[#0f4089] rounded-b-[40px] px-6 pt-12 pb-24 relative overflow-hidden">
        {/* Abstract Background Waves */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="flex justify-between items-center relative z-10">
          <h1 className="text-white font-bold text-xl tracking-wide">My Profile</h1>
          <div className="w-10 h-10 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <User className="text-white" size={20} />
          </div>
        </div>
      </div>

      <div className="px-5 -mt-16 relative z-20">
        <div className="bg-white rounded-[32px] p-6 flex flex-col items-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 mb-6">
          <div className="relative transform -translate-y-12 mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0f4089] to-[#1a4187] flex items-center justify-center text-white text-4xl font-extrabold shadow-lg shadow-blue-900/20 border-4 border-white overflow-hidden">
              {(edit ? form.profilePhoto : profile.profilePhoto) ? (
                <img
                  src={edit ? form.profilePhoto : profile.profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                profile.name?.[0]?.toUpperCase()
              )}
            </div>
            {edit && (
              <label className="absolute bottom-0 right-0 bg-[#f97316] p-2 rounded-full text-white cursor-pointer shadow-md border-2 border-white hover:bg-[#eb6a10] transition-colors">
                <Camera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
            )}
          </div>
          
          <div className="text-center -mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h2>
            <p className="text-gray-500 font-medium text-[15px] mb-4">{profile.email}</p>
            
            <div className="inline-flex items-center gap-2 bg-[#F5F7FA] text-[#0f4089] font-bold px-6 py-2.5 rounded-2xl border border-gray-100 shadow-inner">
              <Coins size={20} className="text-[#f97316]" /> 
              <span className="text-lg">{profile.walletPoints || 0}</span> 
              <span className="text-gray-500 text-sm font-semibold">Points</span>
            </div>
          </div>
        </div>

        {edit ? (
          <form onSubmit={save} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mb-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block ml-1">Full Name</label>
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border-2 border-gray-100 bg-[#F5F7FA] rounded-2xl px-5 py-3.5 text-[15px] font-semibold text-gray-800 focus:outline-none focus:border-[#0f4089]/30 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block ml-1">Phone Number</label>
              <input
                placeholder="Mobile"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="w-full border-2 border-gray-100 bg-[#F5F7FA] rounded-2xl px-5 py-3.5 text-[15px] font-semibold text-gray-800 focus:outline-none focus:border-[#0f4089]/30 transition-colors"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="flex-[2] bg-[#f97316] hover:bg-[#eb6a10] text-white py-4 rounded-xl font-bold text-[15px] disabled:opacity-60 shadow-[0_5px_15px_rgba(249,115,22,0.3)] transition active:scale-[0.98]">
                {saving ? <span className="flex justify-center"><Loader2 size={20} className="animate-spin" /></span> : "Save Changes"}
              </button>
              <button type="button" onClick={() => setEdit(false)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold text-[15px] hover:bg-gray-200 transition active:scale-[0.98]">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <div className="flex flex-col p-2">
              <div className="flex justify-between items-center px-4 py-4 rounded-2xl hover:bg-gray-50 transition">
                <span className="text-gray-500 font-medium text-[15px]">Mobile</span>
                <span className="font-bold text-gray-900">{profile.mobile}</span>
              </div>
              <div className="h-px bg-gray-100 mx-4"></div>
              <div className="flex justify-between items-center px-4 py-4 rounded-2xl hover:bg-gray-50 transition">
                <span className="text-gray-500 font-medium text-[15px]">Account Status</span>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${profile.isActive ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-500 border-red-200"}`}>
                  {profile.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="p-5 pt-0 mt-2">
              <button onClick={() => {
                setForm({
                  name: profile.name,
                  mobile: profile.mobile,
                  profilePhoto: profile.profilePhoto || "",
                });
                setEdit(true);
              }} className="w-full bg-[#E3EBFB] text-[#0f4089] border border-[#0f4089]/10 py-3.5 rounded-xl text-[15px] font-bold hover:bg-[#d0ddf5] transition active:scale-[0.98]">
                Edit Profile Info
              </button>
            </div>
          </div>
        )}

        <button onClick={logout} className="w-full bg-red-50 border border-red-100 text-red-600 py-4 rounded-[20px] text-[15px] font-bold hover:bg-red-100 transition flex justify-center items-center gap-2 active:scale-[0.98]">
          <LogOut size={18} strokeWidth={2.5} /> Log Out
        </button>
      </div>
    </div>
  );
}
