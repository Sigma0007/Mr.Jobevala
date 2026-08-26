import { motion } from "framer-motion";
import {
  Factory,
  Shirt,
  Cpu,
  Radio,
  MonitorSmartphone,
  Truck,
  Car,
  GraduationCap,
  Landmark,
  HeartPulse,
} from "lucide-react";

const INDUSTRIES = [
  { title: "Manufacturing", count: "5", icon: Factory },
  { title: "Fashion", count: "2", icon: Shirt },
  { title: "Electronics", count: "2", icon: Cpu },
  { title: "Advertising/PR", count: "2", icon: Radio },
  { title: "Information Technology", count: "2", icon: MonitorSmartphone },
  { title: "Courier/Logistics", count: "1", icon: Truck },
  { title: "Automobile", count: "1", icon: Car },
  { title: "Education/Training", count: "1", icon: GraduationCap },
  { title: "Banking/Financial Services", count: "1", icon: Landmark },
  { title: "Health & Fitness", count: "1", icon: HeartPulse },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const pillVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function PopularIndustriesPills() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Header Section */}
        <div className="mb-14">
          <span className="text-brand-600 font-bold text-xs md:text-sm tracking-[0.2em] uppercase">
            Explore Sectors
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Popular Industries
          </h2>
        </div>

        {/* Pills Cluster */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-5"
        >
          {INDUSTRIES.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={idx}
                variants={pillVariants}
                style={{ willChange: "transform" }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                // Default: Soft white-to-blue gradient | Hover: Rich brand gradient
                className="group flex items-center gap-3 px-6 py-3.5 md:px-7 md:py-4 rounded-full 
                           bg-gradient-to-br from-white to-blue-50/60 
                           hover:from-brand-600 hover:to-indigo-600
                           shadow-[0_8px_24px_rgba(37,99,235,0.06)] 
                           hover:shadow-[0_12px_30px_rgba(37,99,235,0.25)] 
                           border border-blue-100/50 hover:border-transparent
                           transition-all duration-300 cursor-pointer transform-gpu"
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5 text-brand-600 group-hover:text-white transition-colors duration-300 shrink-0" />

                <div className="flex items-center gap-1.5">
                  <span className="text-sm md:text-base font-bold text-brand-700 group-hover:text-white transition-colors duration-300">
                    {ind.title}
                  </span>
                  <span className="text-sm md:text-base font-medium text-brand-400 group-hover:text-white/80 transition-colors duration-300">
                    ({ind.count})
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
