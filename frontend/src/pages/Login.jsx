import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Building, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

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

      console.log("Login Response:", res);

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
          "Something went wrong",
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
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
      >
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back
          </h2>

          <p className="mt-2 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-brand-600 hover:text-brand-500 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email address
              </label>

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all sm:text-sm"
                placeholder="you@company.com"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>

              <input
                type="password"
                name="password"
                required
                minLength="6"
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* QUICK LOGIN */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs text-center font-medium text-slate-400 uppercase tracking-wider mb-4">
            Or Quick Login As
          </p>

          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => quickLogin("user")}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              <Briefcase className="w-4 h-4 text-brand-500" />
              Candidate
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => quickLogin("provider")}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              <Building className="w-4 h-4 text-brand-500" />
              Employer
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => quickLogin("admin")}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              <Star className="w-4 h-4 text-brand-500" />
              Admin
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
