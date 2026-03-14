import { useState } from "react";
import api from "../api/axios";
import { Gift } from "lucide-react";

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const { data } = await api.post("/users/register", form);
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      window.location.reload();
    } catch (e) {
      setErr(e.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="text-violet-600 mb-3"><Gift size={48} /></div>
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-sm mt-1">Join our rewards program</p>
        </div>

        {err && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-2 mb-4 text-center">{err}</div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          <input
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <span onClick={onSwitch} className="text-violet-600 font-semibold cursor-pointer hover:underline">
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
