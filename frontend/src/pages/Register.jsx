import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Phone,
  Briefcase,
  Eye,
  EyeOff,
  ShieldCheck,
  X,
  RotateCw,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Check,
} from "lucide-react";

import customerservice from "../customer/customerservice";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const roleParam = searchParams.get("role") || location.state?.role;
  const initialRole =
    roleParam === "provider" || roleParam === "user" ? roleParam : "user";

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepassword, setShowRepassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repassword: "",
    phone: "",
    role: initialRole,
  });

  // Password Security Criteria (Alphanumeric, Case-Sensitive & Special Characters)
  const passwordCriteria = [
    {
      id: "length",
      label: "At least 8 characters",
      valid: formData.password.length >= 8,
    },
    {
      id: "uppercase",
      label: "Uppercase letter (A-Z)",
      valid: /[A-Z]/.test(formData.password),
    },
    {
      id: "lowercase",
      label: "Lowercase letter (a-z)",
      valid: /[a-z]/.test(formData.password),
    },
    {
      id: "number",
      label: "Number (0-9)",
      valid: /[0-9]/.test(formData.password),
    },
    {
      id: "special",
      label: "Special character (!@#$%^&*...)",
      valid: /[^A-Za-z0-9]/.test(formData.password),
    },
  ];

  const strengthScore = passwordCriteria.filter((c) => c.valid).length;

  const getStrengthInfo = () => {
    if (!formData.password)
      return { label: "", color: "bg-slate-200", textColor: "text-slate-400", width: "0%" };
    if (strengthScore <= 2)
      return { label: "Weak", color: "bg-rose-500", textColor: "text-rose-600", width: "25%" };
    if (strengthScore === 3)
      return { label: "Fair", color: "bg-amber-500", textColor: "text-amber-600", width: "50%" };
    if (strengthScore === 4)
      return { label: "Good", color: "bg-teal-500", textColor: "text-teal-600", width: "75%" };
    return {
      label: "Strong & High Secured",
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      width: "100%",
    };
  };

  const strengthInfo = getStrengthInfo();

  // Sync role if navigation or URL query param changes
  useEffect(() => {
    const currentRole = searchParams.get("role") || location.state?.role;
    if (currentRole && (currentRole === "user" || currentRole === "provider")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({ ...prev, role: currentRole }));
    }
  }, [searchParams, location.state]);

  // OTP State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef(null);
  const otpInputRef = useRef(null);

  // Load MSG91 Widget Script
  useEffect(() => {
    const scriptId = "msg91-otp-script";
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://verify.msg91.com/otp-provider.js";
      script.async = true;

      script.onload = () => {
        const configuration = {
          widgetId: import.meta.env.VITE_MSG91_WIDGET_ID,
          tokenAuth: import.meta.env.VITE_MSG91_TOKEN_AUTH,
          exposeMethods: true,
          success: (data) => {
            console.log("MSG91 success callback:", data);
          },
          failure: (error) => {
            console.error("MSG91 failure callback:", error);
          },
        };

        if (typeof window.initSendOTP === "function") {
          window.initSendOTP(configuration);
        }
      };

      document.body.appendChild(script);
    } else if (typeof window.initSendOTP === "function") {
      window.initSendOTP({
        widgetId: import.meta.env.VITE_MSG91_WIDGET_ID,
        tokenAuth: import.meta.env.VITE_MSG91_TOKEN_AUTH,
        exposeMethods: true,
      });
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer countdown for resend OTP
  const startResendTimer = () => {
    setCanResend(false);
    setResendTimer(30);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Step 1: Form Validation & Send OTP
  const handleInitiateRegister = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    const cleanPhone = formData.phone.trim().replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      toast.error("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    // High-Security Password Validation
    if (!formData.password) {
      toast.error("Please enter a password");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      toast.error("Password must contain at least one uppercase letter (A-Z)");
      return;
    }

    if (!/[a-z]/.test(formData.password)) {
      toast.error("Password must contain at least one lowercase letter (a-z)");
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      toast.error("Password must contain at least one numeric digit (0-9)");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(formData.password)) {
      toast.error("Password must contain at least one special character (!@#$%^&*...)");
      return;
    }

    // Confirm Password (repassword) Validation
    if (!formData.repassword) {
      toast.error("Please re-enter your password to confirm");
      return;
    }

    if (formData.password !== formData.repassword) {
      toast.error("Passwords do not match. Please verify your re-entered password");
      return;
    }

    // Trigger OTP sending
    sendOTP(cleanPhone);
  };

  // Send OTP via MSG91
  const sendOTP = (phoneNumber) => {
    if (typeof window.sendOtp !== "function") {
      toast.error("OTP Service is initializing. Please try again in a moment.");
      return;
    }

    setSendingOtp(true);
    const fullPhone = phoneNumber.startsWith("91")
      ? phoneNumber
      : `91${phoneNumber}`;

    window.sendOtp(
      fullPhone,
      (data) => {
        console.log("OTP sent successfully:", data);
        setSendingOtp(false);
        setShowOtpModal(true);
        setOtp("");
        startResendTimer();
        toast.success(`OTP sent to +91 ${phoneNumber}`);
        setTimeout(() => {
          if (otpInputRef.current) otpInputRef.current.focus();
        }, 300);
      },
      (error) => {
        console.error("Send OTP error:", error);
        setSendingOtp(false);
        toast.error(
          typeof error === "string"
            ? error
            : error?.message || "Failed to send OTP. Please try again.",
        );
      },
    );
  };

  // Resend OTP via MSG91
  const handleResendOtp = () => {
    if (!canResend) return;

    setSendingOtp(true);
    const cleanPhone = formData.phone.trim().replace(/\D/g, "");
    const fullPhone = cleanPhone.startsWith("91")
      ? cleanPhone
      : `91${cleanPhone}`;

    if (typeof window.retryOtp === "function") {
      window.retryOtp(
        null,
        (data) => {
          console.log("OTP resent:", data);
          setSendingOtp(false);
          startResendTimer();
          toast.success("A new OTP has been sent!");
        },
        (error) => {
          console.error("Resend error:", error);
          if (typeof window.sendOtp === "function") {
            window.sendOtp(
              fullPhone,
              () => {
                setSendingOtp(false);
                startResendTimer();
                toast.success("A new OTP has been sent!");
              },
              (err) => {
                setSendingOtp(false);
                toast.error(err?.message || "Failed to resend OTP");
              },
            );
          } else {
            setSendingOtp(false);
            toast.error(error?.message || "Failed to resend OTP");
          }
        },
      );
    } else if (typeof window.sendOtp === "function") {
      window.sendOtp(
        fullPhone,
        () => {
          setSendingOtp(false);
          startResendTimer();
          toast.success("A new OTP has been sent!");
        },
        (err) => {
          setSendingOtp(false);
          toast.error(err?.message || "Failed to resend OTP");
        },
      );
    }
  };

  // Step 2: Verify OTP via MSG91 and then call registerUser
  const handleVerifyOtp = () => {
    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }

    if (typeof window.verifyOtp !== "function") {
      toast.error("OTP Service error. Please refresh and try again.");
      return;
    }

    setVerifyingOtp(true);

    window.verifyOtp(
      cleanOtp,
      async (data) => {
        console.log("OTP verified successfully:", data);

        const accessToken =
          data?.message || data?.["access-token"] || data?.token;
        const cleanPhone = formData.phone.trim().replace(/\D/g, "");

        // If backend verification endpoint is configured, verify access token
        if (accessToken) {
          try {
            await customerservice.msg91WidgetVerify({
              accessToken,
              mobile: cleanPhone,
            });
          } catch (err) {
            console.warn("Backend widget verify check:", err);
          }
        }

        // Now perform user registration
        await registerUser({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
          phone: cleanPhone,
        });
      },
      (error) => {
        console.error("OTP verification failed:", error);
        setVerifyingOtp(false);
        toast.error(
          typeof error === "string"
            ? error
            : error?.message || "Invalid or expired OTP. Please try again.",
        );
      },
    );
  };

  // Step 3: Register User on backend
  const registerUser = async (data) => {
    try {
      setLoading(true);
      const res = await customerservice.registerUser(data);
      console.log("Register Response:", res);

      if (res.success === true) {
        toast.success(
          `Account created! Welcome, ${res.user?.name || data.name}!`,
        );
        setShowOtpModal(false);
        navigate("/login");
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (error) {
      console.log("Register Error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-brand-200/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-navy-200/30 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg w-full bg-white p-7 sm:p-10 rounded-3xl shadow-[0_15px_40px_-10px_rgba(14,39,56,0.12)] border border-brand-100 relative z-10"
      >
        <div className="text-center">
          <div className="w-13 h-13 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3 border border-brand-200 shadow-xs">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            Create Free Account
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-7 space-y-4" onSubmit={handleInitiateRegister}>
          <div className="space-y-4">
            {/* FULL NAME */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  placeholder="e.g. Hardik Radadiya"
                />
              </div>
            </div>

            {/* ROLE */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Account Type
              </label>

              {/* Visual Role Switcher */}
              <div className="grid grid-cols-2 gap-2 mb-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: "user" }))
                  }
                  className={`py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    formData.role === "user"
                      ? "bg-white text-brand-600 shadow-sm border border-slate-200/80 font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Job Seeker</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: "provider" }))
                  }
                  className={`py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    formData.role === "provider"
                      ? "bg-white text-brand-600 shadow-sm border border-slate-200/80 font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Employer</span>
                </button>
              </div>

              {/* Native Select for standard form interaction */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="user">Job Seeker (Looking for jobs)</option>
                  <option value="provider">
                    Job Provider / Employer (Hiring people)
                  </option>
                </select>
              </div>
            </div>

            {/* PHONE NUMBER */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Phone Number
              </label>
              <div className="relative flex rounded-xl border border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all overflow-hidden">
                <span className="inline-flex items-center gap-1.5 px-3.5 border-r border-slate-200 text-xs font-medium text-slate-600 bg-slate-100/70 select-none">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  +91
                </span>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setFormData((prev) => ({ ...prev, phone: val }));
                    }}
                    className="w-full pl-3 pr-4 py-3 bg-transparent text-slate-900 text-sm focus:outline-none placeholder:text-slate-400 font-mono tracking-wide"
                    placeholder="9876543210"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                We'll send a one-time OTP verification to this mobile number
              </p>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                {formData.password && (
                  <span
                    className={`text-[11px] font-bold transition-colors ${strengthInfo.textColor}`}
                  >
                    {strengthInfo.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-11 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
                  placeholder="e.g. Strong@123#"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Real-time Password Security Criteria & Strength Meter */}
              {formData.password && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                  {/* Visual Strength Meter Bar */}
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${strengthInfo.color}`}
                      style={{ width: strengthInfo.width }}
                    />
                  </div>

                  {/* Requirements Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {passwordCriteria.map((c) => (
                      <div
                        key={c.id}
                        className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${
                          c.valid
                            ? "text-emerald-700 font-semibold"
                            : "text-slate-400"
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            c.valid
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-slate-200 text-slate-400"
                          }`}
                        >
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* REPASSWORD (CONFIRM PASSWORD) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Re-enter Password
                </label>
                {formData.repassword && (
                  <span
                    className={`text-[11px] font-bold flex items-center gap-1 transition-colors ${
                      formData.password === formData.repassword
                        ? "text-emerald-600"
                        : "text-rose-500"
                    }`}
                  >
                    {formData.password === formData.repassword ? (
                      <>
                        <Check className="w-3 h-3" />
                        Passwords match
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3" />
                        Passwords do not match
                      </>
                    )}
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <input
                  type={showRepassword ? "text" : "password"}
                  name="repassword"
                  required
                  value={formData.repassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-11 py-3 bg-slate-50/50 border rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 ${
                    !formData.repassword
                      ? "border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      : formData.password === formData.repassword
                      ? "border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-emerald-50/20"
                      : "border-rose-300 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20"
                  }`}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowRepassword(!showRepassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  title={showRepassword ? "Hide password" : "Show password"}
                >
                  {showRepassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={sendingOtp || loading}
            className="w-full py-3.5 px-4 mt-6 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-navy-900 via-brand-700 to-brand-600 hover:from-navy-950 hover:to-brand-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {sendingOtp ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending OTP...</span>
              </>
            ) : (
              <>
                <span>Continue &amp; Verify Phone</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* OTP Verification Modal Popup */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 sm:p-8 relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                disabled={verifyingOtp || loading}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="text-center pt-2">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Verify Mobile Number
                </h3>
                <p className="text-sm text-slate-500 mt-1.5">
                  Enter the OTP sent to{" "}
                  <span className="font-semibold text-slate-800">
                    +91 {formData.phone}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="text-xs font-semibold text-brand-600 hover:underline mt-1 focus:outline-none"
                >
                  Change phone number?
                </button>
              </div>

              {/* OTP Form Body */}
              <div className="mt-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2 text-center">
                    Enter Verification Code
                  </label>
                  <input
                    ref={otpInputRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setOtp(val);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && otp.length >= 4) {
                        e.preventDefault();
                        handleVerifyOtp();
                      }
                    }}
                    placeholder="• • • •"
                    className="w-full py-3.5 px-4 text-center text-2xl font-bold tracking-[0.5em] bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-slate-900 placeholder:text-slate-300 placeholder:tracking-[0.3em] font-mono transition-all"
                  />
                </div>

                {/* Resend Section */}
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-slate-500">
                    Didn't receive the code?
                  </span>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={sendingOtp}
                      className="font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 focus:outline-none hover:underline"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      Resend OTP
                    </button>
                  ) : (
                    <span className="font-medium text-slate-400">
                      Resend in{" "}
                      <span className="font-bold text-slate-600">
                        {resendTimer}s
                      </span>
                    </span>
                  )}
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={verifyingOtp || loading || otp.length < 4}
                  className="w-full py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-brand-600 hover:bg-brand-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {verifyingOtp || loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying & Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Register</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
