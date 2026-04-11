import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Gift, Phone, Lock, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ mobile: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/users/login", form);
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/bills", { replace: true });
    } catch (e) {
      const errorMsg = e.response?.data?.message || "Invalid Login Credentials";
      setError(errorMsg);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-0 bg-[#8b38df]"
        style={{
          backgroundImage: "url('/magical_bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      <div
        className="min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 relative z-10 overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <h1 className="text-white font-extrabold tracking-widest text-[16px] mb-8 opacity-95 drop-shadow-md">CS PARTNER APP</h1>

        <div
          className="z-10 w-full max-w-[340px] rounded-[1.8rem] p-7 pt-12 relative"
          style={{
            background: 'linear-gradient(180deg, #fefbfe 0%, #f4e8ff 100%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 2px 10px rgba(255,255,255,1)'
          }}
        >
          <div
            className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-[1rem] p-3 shadow-xl"
            style={{ background: 'linear-gradient(180deg, #e4c1ff 0%, #ca8fff 100%)' }}
          >
            <Gift size={32} color="#58169e" fill="#d19fff" strokeWidth={1.5} />
          </div>

          <div className="text-center mb-6 mt-1">
            <h2 className="text-[23px] font-semibold text-[#3a1554] leading-snug tracking-tight mb-[6px]">
              Shop. Earn Points.<br />Get Rewards. 🎁
            </h2>
            <p className="text-[#846b94] text-[13px] tracking-wide">Get reward points on every purchase</p>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="flex items-center bg-[#f1e5fb] rounded-[14px] px-4 py-[13px] shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]">
              <Phone className="h-5 w-5 text-[#a479cc] mr-[10px]" />
              <input
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                required
                className="bg-transparent w-full text-[14px] text-[#4a1c6a] placeholder-[#b28ece] outline-none font-medium"
              />
            </div>

            <div className="flex items-center bg-[#f1e5fb] rounded-[14px] px-4 py-[13px] shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]">
              <Lock className="h-5 w-5 text-[#a479cc] mr-[10px] shrink-0" />
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="bg-transparent w-full text-[14px] text-[#4a1c6a] placeholder-[#b28ece] outline-none font-medium"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="ml-2 text-[#a479cc] shrink-0">
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center font-medium mt-1 mb-1">
                {error}
              </p>
            )}

            <div className="pt-[14px]">
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-bold py-[14px] rounded-[14px] flex justify-center items-center gap-2 text-[16px] active:scale-[0.98] transition-transform"
                style={{
                  background: 'linear-gradient(90deg, #b04bf6 0%, #e852fc 50%, #b04bf6 100%)',
                  boxShadow: '0 6px 15px rgba(232, 82, 252, 0.3), inset 0 2px 5px rgba(255,255,255,0.3)',
                  backgroundSize: '200% auto'
                }}
              >
                🎁 {loading ? "Logging in..." : "Start Earning"} 🎁
              </button>
            </div>
          </form>

          <div className="mt-5 text-center">
            <p className="text-[12.5px] text-[#9375a8] font-medium tracking-wide">100% Secure | No Spam</p>

            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#e0c4f4] to-transparent my-[14px]"></div>

            <p className="text-[14px] text-[#8e6ba1] font-small tracking-wide">
              Don't have an account?{" "}
              <span onClick={() => navigate("/register")} className="text-[#a536eb] font-medium cursor-pointer hover:underline">
                Register
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
