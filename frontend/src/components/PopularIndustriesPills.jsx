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
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const INDUSTRIES = [
  { title: "Information Technology", count: "1,240", icon: MonitorSmartphone },
  { title: "Banking & FinTech", count: "650", icon: Landmark },
  { title: "Health & Pharma", count: "420", icon: HeartPulse },
  { title: "Electronics & Hardware", count: "310", icon: Cpu },
  { title: "Automobile & EV", count: "280", icon: Car },
  { title: "Manufacturing & Heavy", count: "490", icon: Factory },
  { title: "Education & EdTech", count: "230", icon: GraduationCap },
  { title: "Logistics & Supply", count: "340", icon: Truck },
  { title: "Advertising & Media", count: "190", icon: Radio },
  { title: "Fashion & Retail", count: "160", icon: Shirt },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const pillVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function PopularIndustriesPills() {
  const navigate = useNavigate();

  const handleIndustryClick = (industryTitle) => {
    navigate(`/jobs?searchQuery=${encodeURIComponent(industryTitle)}`);
  };

  return (
    <section className="relative py-20 bg-white border-y border-brand-100/60 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Header Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs font-bold text-brand-700 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Leading Sectors
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy-900 tracking-tight">
            Trending Industry Sectors
          </h2>
          <p className="text-sm md:text-base text-slate-500 max-w-lg mx-auto mt-2 font-medium">
            Jump directly into curated openings in your target industry domain.
          </p>
        </div>

        {/* Pills Cluster */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-wrap items-center justify-center gap-3.5 md:gap-4"
        >
          {INDUSTRIES.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <motion.button
                key={idx}
                type="button"
                onClick={() => handleIndustryClick(ind.title)}
                variants={pillVariants}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-3 px-5 py-3 md:px-6 md:py-3.5 rounded-full 
                           bg-white hover:bg-gradient-to-r hover:from-navy-900 hover:to-brand-700
                           text-navy-900 hover:text-white
                           shadow-[0_4px_15px_rgba(14,39,56,0.06)] 
                           hover:shadow-[0_10px_25px_rgba(38,137,125,0.25)] 
                           border border-slate-200/80 hover:border-transparent
                           transition-all duration-300 cursor-pointer text-left"
              >
                <div className="w-8 h-8 rounded-full bg-brand-50 group-hover:bg-white/20 flex items-center justify-center text-brand-600 group-hover:text-white transition-colors shrink-0">
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight">
                    {ind.title}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 group-hover:bg-white/20 text-slate-600 group-hover:text-brand-100 transition-colors">
                    {ind.count}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
