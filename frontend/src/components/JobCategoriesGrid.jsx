import { motion } from "framer-motion";
import { CATEGORIES } from "../Utility/utilites";
import customerservice from "../customer/customerservice";
import { setCategoriesJobPosition } from "../Redux/Dashboard/DashboardAction";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  PenTool,
  ArrowRight,
  Code2,
  Megaphone,
  Calculator,
  Users,
  Car,
  HeadphonesIcon,
  HeartPulse,
  Briefcase,
  Layers,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Default fallback categories in case API returns empty or pending
const FALLBACK_CATEGORIES = [
  {
    value: "software_development",
    label: "Software & Tech",
    count: 840,
    skills: ["React", "Node.js", "Python", "Cloud"],
    icon: Code2,
  },
  {
    value: "design_multimedia",
    label: "Design & Creative",
    count: 320,
    skills: ["Figma", "UI/UX", "Brand", "3D Design"],
    icon: PenTool,
  },
  {
    value: "marketing_sales",
    label: "Marketing & Growth",
    count: 450,
    skills: ["SEO", "Performance Ads", "Content", "CRM"],
    icon: Megaphone,
  },
  {
    value: "finance_accounting",
    label: "Finance & Accounts",
    count: 210,
    skills: ["Taxation", "Auditing", "FinTech", "Payroll"],
    icon: Calculator,
  },
  {
    value: "human_resources",
    label: "Human Resources",
    count: 180,
    skills: ["Talent Acquisition", "HRBP", "Payroll"],
    icon: Users,
  },
  {
    value: "customer_support",
    label: "Customer Support",
    count: 290,
    skills: ["Voice/Chat", "Tech Support", "Client Success"],
    icon: HeadphonesIcon,
  },
  {
    value: "healthcare_pharmacy",
    label: "Healthcare & Med",
    count: 140,
    skills: ["Nursing", "Pharma", "Clinical Research"],
    icon: HeartPulse,
  },
  {
    value: "logistics_supply_chain",
    label: "Logistics & Supply",
    count: 195,
    skills: ["Fleet Mgmt", "Inventory", "Procurement"],
    icon: Car,
  },
  {
    value: "management_executive",
    label: "Executive & Product",
    count: 110,
    skills: ["Product Strategy", "Agile", "Scrum Master"],
    icon: Briefcase,
  },
];

export default function JobCategoriesGrid() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categoryJobPosition } = useSelector((state) => state.dashboard);

  const fetchCategoryJobCounts = async () => {
    try {
      const response = await customerservice.getCategoryJobCounts();
      if (response?.success && response?.data?.length > 0) {
        dispatch(setCategoriesJobPosition(response.data));
      }
    } catch (error) {
      console.error("Error fetching category job counts:", error);
    }
  };

  useEffect(() => {
    if (!categoryJobPosition || categoryJobPosition.length === 0) {
      fetchCategoryJobCounts();
    }
  }, []);

  // Merge live categories with fallback data to ensure rich presentation
  const displayCategories =
    categoryJobPosition && categoryJobPosition.length > 0
      ? categoryJobPosition.map((cat) => {
          const fallback = FALLBACK_CATEGORIES.find((f) => f.value === cat.value);
          const Icon =
            CATEGORIES.find((item) => item.value === cat.value)?.icon ||
            fallback?.icon ||
            PenTool;
          return {
            value: cat.value,
            label: cat.label || cat.title || fallback?.label || "Category",
            count: cat.count || fallback?.count || 12,
            skills: fallback?.skills || ["High Demand", "Verified"],
            icon: Icon,
          };
        })
      : FALLBACK_CATEGORIES;

  const handleCategoryClick = (catValue) => {
    navigate(`/jobs?category=${encodeURIComponent(catValue)}`);
  };

  return (
    <section className="relative py-20 lg:py-28 bg-[#FAF8F5] overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-200/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-navy-200/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-xs font-bold text-brand-700 uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Explore By Domain
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight">
              Popular Job Categories
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl font-medium">
              Find openings tailored to your specific skillset across high-growth industries.
            </p>
          </div>

          <button
            onClick={() => navigate("/jobs")}
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors group cursor-pointer"
          >
            <span>View All 50+ Roles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {displayCategories.slice(0, 9).map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                onClick={() => handleCategoryClick(cat.value)}
                className="group relative bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-brand-400 shadow-[0_4px_20px_rgba(14,39,56,0.04)] hover:shadow-[0_15px_35px_rgba(38,137,125,0.14)] transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
              >
                {/* Accent glow corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-50 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-13 h-13 rounded-2xl bg-brand-50 border border-brand-100/70 flex items-center justify-center text-brand-600 group-hover:bg-gradient-to-tr group-hover:from-navy-900 group-hover:to-brand-600 group-hover:text-white transition-all duration-300 shadow-xs">
                      <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                    </div>

                    <span className="px-3 py-1 rounded-full bg-slate-100 group-hover:bg-brand-50 group-hover:text-brand-700 text-slate-600 text-xs font-bold transition-colors">
                      {cat.count}+ open jobs
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-navy-900 group-hover:text-brand-600 transition-colors">
                    {cat.label}
                  </h3>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {cat.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-md bg-slate-50 text-[11px] font-medium text-slate-500 border border-slate-100 group-hover:border-brand-100 group-hover:text-navy-800 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-navy-800 group-hover:text-brand-600">
                  <span>Explore Openings</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
