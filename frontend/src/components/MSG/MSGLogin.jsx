import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Phone, ShieldCheck, RotateCw, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import customerservice from "../../customer/customerservice";
import { isValidPhoneNumber } from "libphonenumber-js";
import CountryCodeSelector from "../common/CountryCodeSelector";

export default function MSGLogin() {
  const [countryCode, setCountryCode] = useState("+91");
  const [countryIso, setCountryIso] = useState("IN");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef(null);

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
            console.log("MSG91 success:", data);
          },
          failure: (error) => {
            console.error("MSG91 failure:", error);
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

  const sendOTP = () => {
    const cleanMobile = mobile.trim().replace(/\D/g, "");
    if (!cleanMobile) {
      toast.error("Enter a valid mobile phone number");
      return;
    }

    const fullPhone = `${countryCode}${cleanMobile}`;
    let isPhoneValid = false;
    try {
      isPhoneValid = isValidPhoneNumber(fullPhone, countryIso);
    } catch {
      isPhoneValid = cleanMobile.length >= 7 && cleanMobile.length <= 15;
    }

    if (!isPhoneValid) {
      toast.error(`Enter a valid phone number for ${countryCode} (${countryIso})`);
      return;
    }

    setLoading(true);

    if (typeof window.sendOtp !== "function") {
      setLoading(false);
      toast.error("OTP Service initializing, please retry");
      return;
    }

    const dialDigits = (countryCode || "+91").replace(/\D/g, "");
    const formattedSendNumber = cleanMobile.startsWith(dialDigits)
      ? cleanMobile
      : `${dialDigits}${cleanMobile}`;

    window.sendOtp(
      formattedSendNumber,
      (data) => {
        console.log("OTP sent:", data);
        setOtpSent(true);
        setLoading(false);
        startResendTimer();
        toast.success(`OTP sent to ${countryCode} ${cleanMobile}`);
      },
      (error) => {
        console.error("Send OTP error:", error);
        setLoading(false);
        toast.error(error?.message || "Failed to send OTP");
      },
    );
  };

  const handleResend = () => {
    if (!canResend) return;
    setLoading(true);

    if (typeof window.retryOtp === "function") {
      window.retryOtp(
        null,
        (data) => {
          console.log("OTP resent:", data);
          setLoading(false);
          startResendTimer();
          toast.success("OTP resent successfully!");
        },
        (error) => {
          console.error("Resend error:", error);
          setLoading(false);
          toast.error("Failed to resend OTP");
        },
      );
    }
  };

  const verifyOTP = () => {
    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length < 4) {
      toast.error("Enter a valid OTP");
      return;
    }

    setLoading(true);

    if (typeof window.verifyOtp !== "function") {
      setLoading(false);
      toast.error("OTP Service not ready");
      return;
    }

    window.verifyOtp(
      cleanOtp,
      async (data) => {
        console.log("OTP verified:", data);
        const accessToken =
          data?.message || data?.["access-token"] || data?.token;
        const cleanMobile = mobile.trim().replace(/\D/g, "");

        if (!accessToken) {
          console.error("Access token not found:", data);
          setLoading(false);
          toast.error("Verification failed - missing access token");
          return;
        }

        try {
          const response = await customerservice.msg91WidgetVerify({
            accessToken,
            mobile: cleanMobile,
          });

          console.log("Backend response:", response);

          if (!response.success) {
            toast.error(response.message || "Verification failed");
            return;
          }

          if (response.token) {
            localStorage.setItem("token", response.token);
          }
          toast.success("Login successful!");
        } catch (error) {
          console.error(error);
          toast.error("Backend verification failed");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("OTP verification failed:", error);
        setLoading(false);
        toast.error("Invalid or expired OTP");
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3 border border-brand-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">OTP Login</h2>
          <p className="text-sm text-slate-500 mt-1">
            Fast and secure mobile login via MSG91
          </p>
        </div>

        {!otpSent ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                Mobile Number
              </label>
              <div className="flex rounded-xl border border-slate-200 bg-slate-50/50 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500">
                <CountryCodeSelector
                  value={countryCode}
                  selectedIso={countryIso}
                  onChange={({ dialCode, iso }) => {
                    setCountryCode(dialCode);
                    setCountryIso(iso);
                  }}
                />
                <input
                  type="tel"
                  maxLength={15}
                  placeholder={countryIso === "IN" ? "98765 43210" : "Mobile number"}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-3.5 py-3 text-sm focus:outline-none bg-transparent font-mono tracking-wide"
                />
              </div>
            </div>

            <button
              onClick={sendOTP}
              disabled={loading || mobile.length < 10}
              className="w-full py-3.5 px-4 rounded-xl text-white font-semibold bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <>
                  <span>Send OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-2 text-center">
                Enter OTP sent to {countryCode} {mobile}
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full py-3 px-4 text-center text-2xl font-bold tracking-[0.5em] bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-500">Didn't receive code?</span>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="font-semibold text-brand-600 hover:underline flex items-center gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Resend OTP
                </button>
              ) : (
                <span className="text-slate-400">
                  Resend in <span className="font-bold">{resendTimer}s</span>
                </span>
              )}
            </div>

            <button
              onClick={verifyOTP}
              disabled={loading || otp.length < 4}
              className="w-full py-3.5 px-4 rounded-xl text-white font-semibold bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify OTP</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-700 hover:underline pt-1"
            >
              Change phone number
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

