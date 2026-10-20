import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Search,
  HelpCircle,
  BookOpen,
  User,
  Building2,
  FileText,
  CreditCard,
  Lock,
  ChevronDown,
  Sparkles,
  ArrowRight,
  LifeBuoy,
  MessageSquare,
  Mail,
  Zap,
  CheckCircle2,
} from "lucide-react";

export default function HelpCenter() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [feedbackState, setFeedbackState] = useState({});

  const handleFeedback = (articleId, isHelpful) => {
    if (isHelpful) {
      setFeedbackState((prev) => ({ ...prev, [articleId]: "yes" }));
      toast.success("Thank you for your feedback! We're glad this helped.");
    } else {
      setFeedbackState((prev) => ({ ...prev, [articleId]: "no" }));
      toast("Article not helpful? Redirecting you to our support team...", {
        icon: "🎧",
        duration: 3000,
      });
      setTimeout(() => {
        navigate("/contact");
      }, 1000);
    }
  };

  const categories = [
    { id: "all", name: "All Topics", icon: LifeBuoy },
    { id: "candidates", name: "Job Seekers", icon: User },
    { id: "employers", name: "Employers & Hiring", icon: Building2 },
    { id: "resume", name: "Resume Builder", icon: FileText },
    { id: "billing", name: "Billing & Plans", icon: CreditCard },
    { id: "security", name: "Account & Security", icon: Lock },
  ];

  const articles = [
    // Job Seekers
    {
      id: 1,
      category: "candidates",
      title: "How do I create and optimize my candidate profile?",
      summary: "Learn how to add work experience, skills, and portfolio links to increase recruiter views by 3x.",
      content: "Navigate to your Candidate Dashboard after logging in. Fill in your headline, core technical or soft skills, education history, and upload your latest resume. Candidates with 100% complete profiles appear at the top of recruiter searches.",
    },
    {
      id: 2,
      category: "candidates",
      title: "How can I track the status of my job applications?",
      summary: "Follow your applications in real-time from Submitted to Under Review, Shortlisted, or Interviewed.",
      content: "Go to your Candidate Dashboard and click on the 'My Applications' tab. You will see live color-coded status badges: 'Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', or 'Declined'.",
    },
    {
      id: 3,
      category: "candidates",
      title: "Are there any hidden fees for applying to jobs?",
      summary: "Our platform is 100% free for job seekers. Never pay an employer for application review or training.",
      content: "MR. JOB WALA is completely free for candidates. If any employer or recruiter asks for money for an interview, equipment, or application processing, report them immediately via our Report button.",
    },

    // Employers
    {
      id: 4,
      category: "employers",
      title: "How do I post a new job vacancy and manage applicants?",
      summary: "Step-by-step guide on creating targeted job posts and reviewing incoming candidate resumes.",
      content: "Log in as an Employer and click 'Post a Job' in your Employer Dashboard. Specify the job title, category, salary range, required skills, and job location (Remote, Hybrid, Onsite). Once published, incoming applications will stream directly to your ATS pipeline.",
    },
    {
      id: 5,
      category: "employers",
      title: "How does the candidate search and filter system work?",
      summary: "Filter talent by experience, location, verified skills, and salary expectations.",
      content: "Navigate to 'Find Candidates'. Use our multifaceted filters to query candidates based on specific technologies, years of experience, current location, and availability.",
    },
    {
      id: 6,
      category: "employers",
      title: "How can I get my company verified with a Trust Badge?",
      summary: "Verified employers enjoy higher candidate response rates and priority listing in search.",
      content: "In your Employer Dashboard profile, submit your official corporate registration and website domain. Our verification team validates credentials within 24 business hours.",
    },

    // Resume Builder
    {
      id: 7,
      category: "resume",
      title: "How do I use the Interactive Resume Builder?",
      summary: "Create ATS-friendly, professionally styled modern resumes with instant PDF export.",
      content: "Visit the 'Resume Builder' from the top navigation. Select a curated template, fill in your experience, skills, and projects, and watch the real-time live preview update. You can download a high-res PDF with one click.",
    },
    {
      id: 8,
      category: "resume",
      title: "What makes a resume ATS-compliant?",
      summary: "Formatting tips to ensure your resume passes Applicant Tracking Systems with flying colors.",
      content: "Our builder uses clean semantic typography, standard section headings (Experience, Education, Skills), and clean bullet points without unreadable multi-column graphics, ensuring 99.8% ATS readability.",
    },

    // Billing & Plans
    {
      id: 9,
      category: "billing",
      title: "What payment methods do you support for employer plans?",
      summary: "We support all major credit cards, debit cards, UPI, and international wire transfers.",
      content: "All payments are processed with end-to-end PCI-DSS compliant encryption. We accept Visa, MasterCard, American Express, Stripe, UPI, and invoice billing for enterprise teams.",
    },
    {
      id: 10,
      category: "billing",
      title: "Can I cancel or upgrade my subscription plan anytime?",
      summary: "Manage your active plan seamlessly with prorated upgrades or instant cancellation.",
      content: "Yes, you can upgrade or cancel anytime from the Pricing & Plans tab in your Employer Dashboard. Unused job posting credits remain valid until the end of your billing cycle.",
    },

    // Security
    {
      id: 11,
      category: "security",
      title: "How do I reset my password if I am locked out?",
      summary: "Fast recovery steps to regain access to your account securely.",
      content: "On the Login page, click 'Forgot Password'. Enter your registered email address and we will immediately send you a secure password reset link valid for 30 minutes.",
    },
    {
      id: 12,
      category: "security",
      title: "How does MR. JOB WALA protect my personal contact information?",
      summary: "Our privacy-first architecture guarantees your phone and email are never shared without consent.",
      content: "Your private contact information is only visible to recruiters when you explicitly apply to their job listing. We never sell your resume or personal details to third-party telemarketers.",
    },
  ];

  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Hero Search Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-brand-50/70 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Knowledge Base & Support Center
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-navy-950 tracking-tight"
          >
            How Can We Assist You Today?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Search our curated guides, troubleshooting articles, and frequently asked questions.
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 max-w-2xl mx-auto"
          >
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
              <div className="pl-3 pr-2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search for answers (e.g. resume, billing, apply, post job)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-navy-900 placeholder-slate-400 text-sm sm:text-base outline-none px-2 py-2"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-slate-600 px-3 py-1 bg-slate-100 rounded-lg mr-1 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-105"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-navy-950"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-brand-600"}`} />
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Articles & FAQ Accordion Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-navy-950">
            {searchQuery ? `Search Results (${filteredArticles.length})` : "Help Articles & Guides"}
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Showing {filteredArticles.length} guides
          </span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy-950 mb-1">
              No matching articles found
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              We couldn't find anything matching "{searchQuery}". Try searching for different keywords or contact our support team.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="bg-brand-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-colors"
            >
              Reset Search Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article) => {
              const isExpanded = expandedFaq === article.id;
              return (
                <div
                  key={article.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-brand-300 transition-all duration-200 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : article.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 px-2 py-0.5 rounded-md border border-brand-100">
                          {article.category}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-navy-950 hover:text-brand-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {article.summary}
                      </p>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0 transition-transform duration-200 ${
                        isExpanded ? "rotate-180 bg-brand-50 text-brand-600 border-brand-200" : ""
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-100 bg-slate-50/50 p-5 sm:p-6"
                      >
                        <div className="text-slate-700 text-sm sm:text-base leading-relaxed">
                          {article.content}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                          <span>Was this article helpful?</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleFeedback(article.id, true)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                                feedbackState[article.id] === "yes"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm"
                                  : "bg-white border-slate-200 text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                              }`}
                            >
                              👍 Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFeedback(article.id, false)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                                feedbackState[article.id] === "no"
                                  ? "bg-rose-50 text-rose-700 border-rose-300 shadow-sm"
                                  : "bg-white border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700"
                              }`}
                            >
                              👎 No
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Still Need Help Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-brand-950 rounded-3xl p-8 sm:p-10 text-white border border-navy-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-8">
              <div className="inline-flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-wider mb-2">
                <LifeBuoy className="w-4 h-4" />
                Live Human Support
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-2">
                Still can't find what you are looking for?
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Our support agents and career mentors are available Monday to Saturday to assist you with any questions.
              </p>
            </div>
            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3">
              <Link
                to="/contact"
                className="bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-brand-500/30 text-center transition-all hover:scale-105"
              >
                Contact Support Team
              </Link>
              <Link
                to="/feed"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm px-6 py-3 rounded-xl text-center backdrop-blur-sm transition-all"
              >
                Ask the Community
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
