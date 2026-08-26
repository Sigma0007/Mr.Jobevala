import { motion } from "framer-motion";
import {
  Calculator,
  Megaphone,
  PenTool,
  Code2,
  Users,
  Car,
  HeadphonesIcon,
  HeartPulse,
  Briefcase,
} from "lucide-react";

const CATEGORIES = [
  {
    title: "Accounting / Finance",
    count: "2 open positions",
    icon: Calculator,
  },
  { title: "Marketing", count: "86 open positions", icon: Megaphone },
  { title: "Design", count: "43 open positions", icon: PenTool },
  { title: "Development", count: "12 open positions", icon: Code2 },
  { title: "Human Resource", count: "55 open positions", icon: Users },
  { title: "Automotive Jobs", count: "2 open positions", icon: Car },
  {
    title: "Customer Service",
    count: "2 open positions",
    icon: HeadphonesIcon,
  },
  { title: "Health and Care", count: "25 open positions", icon: HeartPulse },
  { title: "Project Management", count: "92 open positions", icon: Briefcase },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Optimized card animation (using Y translation only)
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function JobCategoriesGrid() {
  return (
    <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
      {/* --- GPU-Accelerated Background --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          style={{ willChange: "transform, opacity" }} // Forces GPU rendering
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-brand-50 rounded-full blur-[80px] transform-gpu"
        />
        <motion.div
          style={{ willChange: "transform, opacity" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
          }}
          className="absolute top-[40%] -right-[10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-indigo-50 rounded-full blur-[100px] transform-gpu"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Popular Job Categories
          </h2>
          <p className="text-base text-slate-500 font-medium">
            2020 jobs live - 293 added today.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                style={{ willChange: "transform" }}
                className="group flex items-center gap-4 md:gap-5 p-5 md:p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-brand-100 transition-all duration-300 cursor-pointer transform-gpu hover:-translate-y-1"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl bg-brand-50 flex items-center justify-center group-hover:bg-brand-600 transition-colors duration-300">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-brand-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors duration-300">
                    {cat.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 mt-0.5 font-medium">
                    ({cat.count})
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
