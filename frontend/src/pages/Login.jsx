import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Building, Star, Sparkles, ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Logo from "../../public/Image/logo.jpeg";

import customerservice from "../customer/customerservice";
import { loginUser } from "../Redux/Auth/AuthAction";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const redirectByRole = (role) => {
    const roleRoutes = {
      admin: "/admin/dashboard",
      provider: "/provider/dashboard",
      user: "/user/dashboard",
    };
    navigate(roleRoutes[role] || "/");
  };

  const login = async (data) => {
    try {
      setLoading(true);
      const res = await customerservice.loginUser(data);

      if (res.success === true) {
        if (res.token) {
          localStorage.setItem("token", res.token);
        }

        dispatch(loginUser(res));
        toast.success(`Welcome back, ${res.user.name}!`);
        redirectByRole(res.user.role);
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (error) {
      console.log("Login Error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  const quickLogin = async (role) => {
    const quickAccounts = {
      user: {
        email: "user@example.com",
        password: "123456",
      },
      provider: {
        email: "provider@example.com",
        password: "123456",
      },
      admin: {
        email: "admin@gmail.com",
        password: "Admin@123",
      },
    };
    await login(quickAccounts[role]);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-brand-200/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-navy-200/30 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-[0_15px_40px_-10px_rgba(14,39,56,0.12)] border border-brand-100 relative z-10"
      >
        {/* Logo & Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-brand-200 shadow-sm bg-white p-0.5 group-hover:scale-105 transition-transform">
              <img src={Logo} alt="MR. JOB WALA" className="w-full h-full object-contain" />
            </div>
            <div className="text-left">
              <span className="text-xl font-black text-navy-950 block leading-tight">
                MR. <span className="text-brand-600">JOB WALA</span>
              </span>
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest block">
                Career Guardian
              </span>
            </div>
          </Link>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 font-medium">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Sign up free
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* EMAIL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4 text-brand-600" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-slate-200 rounded-xl text-navy-950 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium placeholder:text-slate-400"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-brand-600" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-slate-200 rounded-xl text-navy-950 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-navy-900 via-brand-700 to-brand-600 hover:from-navy-950 hover:to-brand-700 shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In to Account"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* QUICK LOGIN BUTTONS */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-[11px] text-center font-bold text-slate-400 uppercase tracking-wider mb-3">
            Quick One-Click Demo Access
          </p>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => quickLogin("user")}
              className="flex flex-col items-center justify-center gap-1 py-2.5 px-2 border border-slate-200 rounded-xl text-xs font-bold text-navy-900 bg-white hover:bg-brand-50/70 hover:border-brand-300 transition-all cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-brand-600" />
              Candidate
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => quickLogin("provider")}
              className="flex flex-col items-center justify-center gap-1 py-2.5 px-2 border border-slate-200 rounded-xl text-xs font-bold text-navy-900 bg-white hover:bg-brand-50/70 hover:border-brand-300 transition-all cursor-pointer"
            >
              <Building className="w-4 h-4 text-brand-600" />
              Employer
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => quickLogin("admin")}
              className="flex flex-col items-center justify-center gap-1 py-2.5 px-2 border border-slate-200 rounded-xl text-xs font-bold text-navy-900 bg-white hover:bg-brand-50/70 hover:border-brand-300 transition-all cursor-pointer"
            >
              <Star className="w-4 h-4 text-brand-600" />
              Admin
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
