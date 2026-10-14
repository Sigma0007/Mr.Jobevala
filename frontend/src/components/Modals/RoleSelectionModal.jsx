import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function RoleSelectionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Never show if user is already logged in
    const token = localStorage.getItem("token");
    if (token) return;

    // 2. Never show on auth/dashboard pages
    const path = location.pathname.toLowerCase();
    if (
      path.startsWith("/login") ||
      path.startsWith("/register") ||
      path.startsWith("/admin") ||
      path.startsWith("/provider") ||
      path.startsWith("/user") ||
      path.startsWith("/msglogin")
    ) {
      return;
    }

    // 3. Check if already dismissed in this session
    const hasDismissed = sessionStorage.getItem("role_modal_dismissed");
    if (hasDismissed) return;

    // 4. Timer to open: Wait for InitialLoader (3.5s) if it's the first visit of the session
    const hasSeenLoader = sessionStorage.getItem("initial_loader_seen");
    const delay = hasSeenLoader ? 800 : 3800;

    const timer = setTimeout(() => {
      // Re-verify auth & path in case user navigated during delay
      const currentToken = localStorage.getItem("token");
      const currentPath = window.location.pathname.toLowerCase();
      if (
        !currentToken &&
        !currentPath.startsWith("/login") &&
        !currentPath.startsWith("/register")
      ) {
        setIsOpen(true);
      }
    }, delay);

    // Mark that loader time has elapsed for future routes in this session
    sessionStorage.setItem("initial_loader_seen", "true");

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Support opening modal from anywhere via custom event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-role-modal", handleOpen);
    return () => window.removeEventListener("open-role-modal", handleOpen);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    sessionStorage.setItem("role_modal_dismissed", "true");
    setIsOpen(false);
  };

  const handleSelectRole = (role) => {
    sessionStorage.setItem("role_modal_dismissed", "true");
    setIsOpen(false);
    navigate(`/register?role=${role}`, { state: { role } });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] border border-slate-100 p-6 sm:p-10 z-10 overflow-hidden"
          >
            {/* Top Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
              title="Close"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Modal Heading */}
            <div className="mb-6 sm:mb-8 pr-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                What do you want to do?
              </h2>
            </div>

            {/* Two Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Card 1: Job Seeker ("I want a job") */}
              <div
                onClick={() => handleSelectRole("user")}
                className="group cursor-pointer flex flex-col items-center"
              >
                <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden shadow-md group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 border border-slate-100">
                  {/* Photo of Job Seeker */}
                  <img
                    src="/Image/role_job_seeker.jpg"
                    alt="Job Seeker"
                    className="absolute inset-0 w-full h-full object-cover object-[70%_center] group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Angled Royal Blue Diagonal Banner */}
                  <div
                    className="absolute inset-0 flex items-center pointer-events-none"
                    style={{
                      background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                      clipPath: "polygon(0 0, 63% 0, 42% 100%, 0 100%)",
                    }}
                  >
                    <div className="w-[52%] pl-6 sm:pl-8 pr-2">
                      <span className="text-white text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight drop-shadow-sm block">
                        I want a job
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtitle Underneath */}
                <p className="mt-3.5 text-base sm:text-lg font-medium text-blue-700 group-hover:text-blue-900 group-hover:font-semibold transition-all">
                  मुझे नौकरी चाहिए
                </p>
              </div>

              {/* Card 2: Recruiter / Employer ("I want to hire people") */}
              <div
                onClick={() => handleSelectRole("provider")}
                className="group cursor-pointer flex flex-col items-center"
              >
                <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden shadow-md group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 border border-slate-100">
                  {/* Photo of Employer / Recruiter */}
                  <img
                    src="/Image/role_employer.jpg"
                    alt="Employer"
                    className="absolute inset-0 w-full h-full object-cover object-[70%_center] group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Angled Royal Blue Diagonal Banner */}
                  <div
                    className="absolute inset-0 flex items-center pointer-events-none"
                    style={{
                      background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                      clipPath: "polygon(0 0, 63% 0, 42% 100%, 0 100%)",
                    }}
                  >
                    <div className="w-[52%] pl-6 sm:pl-8 pr-2">
                      <span className="text-white text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight drop-shadow-sm block">
                        I want to hire people
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtitle Underneath */}
                <p className="mt-3.5 text-base sm:text-lg font-medium text-blue-700 group-hover:text-blue-900 group-hover:font-semibold transition-all">
                  मुझे लोग काम पे रखने है
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
