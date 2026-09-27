import { motion } from "framer-motion";
import { Star, Quote, Sparkles, TrendingUp, CheckCircle2 } from "lucide-react";

const REVIEWS = [
  {
    name: "Aditya Verma",
    role: "Senior Frontend Engineer",
    company: "Zomato",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop",
    hike: "+85% CTC Hike",
    rating: 5,
    quote:
      "I was struggling with generic job boards with zero replies. On MR. JOB WALA, the AI matchmaker paired me directly with the VP of Engineering, and I signed my offer within 10 days!",
  },
  {
    name: "Pooja Hegde",
    role: "Lead Product Designer",
    company: "Swiggy",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
    hike: "+110% CTC Hike",
    rating: 5,
    quote:
      "The built-in resume builder completely revamped my ATS score. Recruiters could preview my portfolio directly. It felt like having a personal career agent advocating for me.",
  },
  {
    name: "Rohan Kulkarni",
    role: "Cloud DevOps Specialist",
    company: "Razorpay",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    hike: "+70% CTC Hike",
    rating: 5,
    quote:
      "Zero spam and 100% verified HRs. The real-time notification system alerted me the second my interview was scheduled. Highly recommend to every tech professional!",
  },
];

export default function SuccessStoriesSection() {
  return (
    <section className="py-20 lg:py-28 bg-white border-b border-brand-100/60 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-xs font-bold text-brand-700 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Candidate Success Stories
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight mb-4">
            Hear From Those Who Got Hired
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Real stories from candidates who found high-impact careers with MR. JOB WALA.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.12 }}
              className="group bg-[#FAF8F5] p-8 rounded-3xl border border-brand-100/80 hover:border-brand-400 hover:bg-white shadow-[0_4px_20px_rgba(14,39,56,0.03)] hover:shadow-[0_15px_35px_rgba(38,137,125,0.12)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating & Hike Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-amber-500 fill-amber-400"
                      />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    {rev.hike}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-navy-950 font-normal leading-relaxed italic mb-6">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-5 border-t border-slate-200/70 flex items-center gap-3.5">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-brand-300 shadow-sm"
                />
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-navy-950 flex items-center gap-1">
                    {rev.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 fill-brand-100" />
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {rev.role} • <strong className="text-brand-700">{rev.company}</strong>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
