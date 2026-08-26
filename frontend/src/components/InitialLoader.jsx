import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 3.5 seconds total for the full dramatic zoom effect
    const timer = setTimeout(() => setIsLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-50 overflow-hidden"
        >
          {/* Main Laptop Container scaling into the camera */}
          <motion.div
            style={{ willChange: "transform, opacity" }} // HARDWARE ACCELERATION (Fixes the lag!)
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{
              scale: [0.8, 1, 1, 60], // HUGE zoom is back, but optimized for the GPU
              y: [20, 0, 0, 0],
              opacity: [0, 1, 1, 1],
            }}
            transition={{
              times: [0, 0.15, 0.7, 1], // 15% intro, hold until 70%, then massive ZOOM
              duration: 3.5,
              ease: [0.25, 1, 0.36, 1], // Super smooth custom easing curve
            }}
            className="relative flex flex-col items-center justify-center transform-origin-center"
          >
            {/* The Laptop Lid / Bezel - Realistic Dark Mode */}
            <div className="relative w-72 sm:w-[400px] h-48 sm:h-[260px] bg-slate-900 rounded-t-2xl sm:rounded-t-3xl border-[6px] sm:border-[8px] border-slate-900 shadow-2xl flex items-center justify-center overflow-hidden ring-1 ring-black/50">
              {/* Premium Screen Glare */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent z-20 pointer-events-none" />

              {/* The Blue App "Screen" Background */}
              <div className="absolute inset-0 bg-blue-50 flex items-center justify-center overflow-hidden">
                {/* 
                  LAG FIX: Using a smooth, scaling CSS radial gradient 
                  instead of the heavy rotating conic gradient that crashed performance.
                */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(37,99,235,0.1)_0%,rgba(255,255,255,0)_60%)]"
                />

                {/* Animated Text - Timing FIXED */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: [0, 1, 1, 0], // Fades in FAST, holds, fades out right before zoom
                    scale: [0.9, 1, 1, 1.5], // Gives a subtle push before the big zoom
                  }}
                  transition={{
                    times: [0, 0.1, 0.7, 1], // Pops in by 10%, fades out at 70%
                    duration: 3,
                    ease: "easeOut",
                  }}
                  className="relative z-30 flex flex-col items-center gap-3 px-4 text-center"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/40 border border-blue-400/30">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-slate-900 font-bold text-base sm:text-lg tracking-wide max-w-[220px] leading-tight">
                    New opportunity <br />
                    <span className="text-blue-600 font-extrabold text-lg sm:text-xl">
                      waiting for you.
                    </span>
                  </h1>
                </motion.div>
              </div>
            </div>

            {/* The Laptop Base / Keyboard */}
            <div className="w-80 sm:w-[460px] h-3 sm:h-4 bg-gradient-to-b from-slate-300 to-slate-400 rounded-b-xl sm:rounded-b-2xl shadow-2xl relative z-20 flex justify-center border-t border-slate-200">
              {/* Laptop trackpad notch */}
              <div className="w-20 h-1 sm:h-1.5 bg-slate-500/30 rounded-b-md shadow-inner"></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
