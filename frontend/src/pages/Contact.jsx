import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  Building2,
  Headphones,
  FileQuestion,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "Job Seeker Support",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const contactChannels = [
    {
      icon: Headphones,
      title: "Candidate Support",
      detail: "support@jobwala.com",
      subtext: "Assistance with applications, profile, and resume builder",
      badge: "Average response: < 2 hrs",
      action: "mailto:support@jobwala.com",
    },
    {
      icon: Building2,
      title: "Employer & Enterprise",
      detail: "enterprise@jobwala.com",
      subtext: "Custom hiring plans, candidate searches, and verified badges",
      badge: "Dedicated Account Mgr",
      action: "mailto:enterprise@jobwala.com",
    },
    {
      icon: Phone,
      title: "Direct Helpline",
      detail: "+1 (800) 555-0199",
      subtext: "Mon - Fri, 9:00 AM - 7:00 PM EST",
      badge: "Toll-Free Support",
      action: "tel:+18005550199",
    },
    {
      icon: MapPin,
      title: "Global Headquarters",
      detail: "100 Innovation Parkway, Suite 400",
      subtext: "San Francisco, CA 94105, United States",
      badge: "Walk-ins by Appointment",
      action: "https://maps.google.com/?q=100+Innovation+Parkway,+San+Francisco,+CA+94105",
    },
  ];

  const faqs = [
    {
      q: "How fast do employers respond to submitted applications?",
      a: "Our verified employers typically review applications within 48 to 72 business hours. You can track real-time application status directly in your Candidate Dashboard.",
    },
    {
      q: "Is creating an account and applying for jobs free for candidates?",
      a: "Yes! Creating an account, building resumes, and applying to unlimited job listings on MR. JOB WALA is 100% free forever for candidates.",
    },
    {
      q: "How can employers verify their company account?",
      a: "Employers can request verification by submitting valid corporate registration or domain email credentials through the Employer Dashboard. Verification takes under 24 hours.",
    },
    {
      q: "How do I report a suspicious listing or user?",
      a: "Select 'Report Listing' directly on the job detail page, or email safety@jobwala.com. Our Trust & Safety team investigates all reports within 60 minutes.",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Thank you! Your inquiry has been dispatched to our support team.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "Job Seeker Support",
        message: "",
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-16 lg:py-20 bg-gradient-to-b from-brand-50/50 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            We're Here For You 24/7
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-navy-950 tracking-tight"
          >
            Get in Touch With Our Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Have questions regarding job listings, employer plans, resume optimization, or partnerships? Reach out and our specialists will assist you promptly.
          </motion.p>
        </div>
      </section>

      {/* Main Content: Form + Contact Channels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Interactive Channels & FAQs */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-2xl font-black text-navy-950 tracking-tight mb-2">
                Direct Channels
              </h2>
              <p className="text-slate-600 text-sm mb-6">
                Choose the direct contact stream suited to your inquiry:
              </p>

              <div className="grid grid-cols-1 gap-4">
                {contactChannels.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <div
                      key={c.title}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className="font-bold text-navy-950 text-sm sm:text-base">
                              {c.title}
                            </h3>
                            <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
                              {c.badge}
                            </span>
                          </div>
                          <a
                            href={c.action}
                            target={c.action.startsWith("http") ? "_blank" : undefined}
                            rel={c.action.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="text-brand-600 font-bold text-sm hover:underline block mb-1"
                          >
                            {c.detail}
                          </a>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {c.subtext}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Help Box */}
            <div className="bg-navy-950 rounded-2xl p-6 text-white border border-navy-800 shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <HelpCircle className="w-6 h-6 text-brand-400" />
                <h4 className="font-bold text-lg">Looking for instant answers?</h4>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                Check our interactive Knowledge Base for step-by-step tutorials, resume guides, and troubleshooting.
              </p>
              <Link
                to="/help-center"
                className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                Visit Help Center
              </Link>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/50">
              <h2 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight mb-2">
                Send Us a Message
              </h2>
              <p className="text-slate-600 text-sm mb-8">
                Fill out the form below and our team will get back to you within 2 business hours.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-950 mb-2">
                    Message Successfully Sent!
                  </h3>
                  <p className="text-emerald-800 text-sm max-w-md mx-auto mb-6">
                    A support ticket has been created and assigned to an expert agent. We will respond directly to your email.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-emerald-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm text-navy-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm text-navy-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                        Inquiry Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm text-navy-900"
                      >
                        <option value="Job Seeker Support">Job Seeker Support</option>
                        <option value="Employer Hiring Plans">Employer Hiring Plans</option>
                        <option value="Technical Issue / Bug">Technical Issue / Bug</option>
                        <option value="Billing & Invoicing">Billing & Invoicing</option>
                        <option value="Partnership & Press">Partnership & Press</option>
                        <option value="General Feedback">General Feedback</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="Brief summary of your inquiry"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm text-navy-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                      Detailed Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please explain how we can assist you..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm text-navy-900 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Transmitting Message...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Transmit Inquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Interactive FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-black text-navy-950">
            Frequently Asked Inquiries
          </h3>
          <p className="text-slate-600 text-sm mt-1">
            Fast resolutions to standard questions
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.q}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-navy-950 hover:text-brand-600 transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-brand-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
