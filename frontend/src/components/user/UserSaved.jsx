import { motion } from "framer-motion";
import { Bookmark, MapPin, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

export default function UserSaved() {
  const savedJobs = [
    {
      id: 1,
      title: "Lead Product Designer",
      company: "Spotify",
      location: "Remote",
      salary: "$140k - $160k",
      logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150&q=80",
    },
    {
      id: 2,
      title: "Backend Engineer (Go)",
      company: "Stripe",
      location: "San Francisco, CA",
      salary: "$160k - $190k",
      logo: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=150&q=80",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
    >
      <div className="mb-8">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Saved Jobs
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Jobs you've bookmarked for later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedJobs.map((job) => (
          <div
            key={job.id}
            className="p-6 border border-slate-100 rounded-2xl hover:shadow-md transition-shadow bg-slate-50/50 relative group"
          >
            <button
              onClick={() => toast.success("Job removed from saved")}
              className="absolute top-4 right-4 p-2 text-brand-600 bg-brand-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <img
              src={job.logo}
              alt={job.company}
              className="w-12 h-12 rounded-xl object-cover border border-slate-100 mb-4"
            />
            <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
            <p className="text-sm text-slate-500 font-medium mb-4">
              {job.company}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-6">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />{" "}
                {job.salary}
              </span>
            </div>
            <button className="w-full py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
