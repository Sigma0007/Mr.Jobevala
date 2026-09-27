import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Server,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("intro");
  const [searchTerm, setSearchTerm] = useState("");

  const sections = [
    { id: "intro", title: "1. Introduction & Overview" },
    { id: "collection", title: "2. Information We Collect" },
    { id: "usage", title: "3. How We Use Your Data" },
    { id: "cookies", title: "4. Cookies & Tracking Technologies" },
    { id: "sharing", title: "5. Information Sharing & Third Parties" },
    { id: "rights", title: "6. Your Privacy Rights (GDPR & CCPA)" },
    { id: "security", title: "7. Security & Encryption Standards" },
    { id: "retention", title: "8. Data Retention & Deletion" },
    { id: "contact", title: "9. Contact Data Protection Officer" },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success("Preparing PDF version of Privacy Policy...");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Header Banner */}
      <section className="relative overflow-hidden py-14 bg-gradient-to-b from-brand-50/60 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/70 border border-brand-200 text-brand-800 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            Commitment to Candidate & Employer Trust
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-navy-950 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Last Updated: <span className="font-semibold text-navy-900">September 2026</span> • Version 3.4
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-navy-900 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition-all"
            >
              <Download className="w-4 h-4 text-brand-600" />
              Download / Print Policy
            </button>
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Sticky Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4 no-print">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search policy content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:bg-white focus:border-brand-500 focus:outline-none transition-all"
                />
              </div>

              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Table of Contents
              </h3>

              <nav className="space-y-1">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSection(sec.id)}
                    className={`block px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      activeSection === sec.id
                        ? "bg-brand-50 text-brand-700 font-bold border-l-2 border-brand-600 pl-3.5"
                        : "text-slate-600 hover:bg-slate-50 hover:text-navy-950"
                    }`}
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Safety Commitment Callout */}
            <div className="bg-gradient-to-br from-navy-900 to-brand-950 rounded-2xl p-5 text-white shadow-md border border-navy-800">
              <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Lock className="w-4 h-4" />
                Our Data Guarantee
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                We never sell or monetize candidate resumes, contact numbers, or private communications to third-party data brokers.
              </p>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/40 text-navy-950 space-y-10 leading-relaxed">
            {/* Section 1 */}
            <section id="intro" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-navy-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" />
                1. Introduction & Overview
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                At <strong>MR. JOB WALA</strong> ("we," "our," or "the Platform"), we are committed to safeguarding the privacy and personal integrity of candidates, employers, and visitors. This Privacy Policy details how we collect, store, utilize, and protect your information when accessing our web services, job matching platform, and resume generation tools.
              </p>
              <div className="p-4 bg-brand-50 rounded-xl border border-brand-100 text-brand-950 text-xs sm:text-sm">
                By accessing or registering with MR. JOB WALA, you acknowledge and agree to the data practices described in this policy.
              </div>
            </section>

            {/* Section 2 */}
            <section id="collection" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-navy-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-brand-600" />
                2. Information We Collect
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                We collect personal and professional data to facilitate accurate job matchmaking and account security:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-navy-900 text-sm mb-2">Candidate Data</h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>Full name, email address, phone number</li>
                    <li>Uploaded resumes, work experience, education</li>
                    <li>Skills, portfolios, GitHub/LinkedIn URLs</li>
                    <li>Job search preferences and salary expectations</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-navy-900 text-sm mb-2">Employer Data</h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>Corporate entity name, registration, GST/Tax ID</li>
                    <li>Recruiter official email, phone, and role</li>
                    <li>Job listings, compensation benchmarks, requirements</li>
                    <li>Billing details and payment histories</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="usage" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-navy-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Server className="w-5 h-5 text-brand-600" />
                3. How We Use Your Data
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                We process your personal information strictly for legitimate operational purposes:
              </p>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                  <span><strong>AI Matchmaking:</strong> Parsing skills and preferences to suggest relevant job postings or qualified applicants.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Direct Communication:</strong> Alerting candidates to interview requests, status changes, and platform announcements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Fraud Prevention:</strong> Detecting fraudulent recruiters, spam postings, or malicious bots.</span>
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="cookies" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-navy-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-brand-600" />
                4. Cookies & Tracking Technologies
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                We utilize essential session cookies, local storage tokens, and anonymous analytical markers to maintain authentication state, preserve user dashboard preferences, and monitor performance. You may disable non-essential cookies via browser settings.
              </p>
            </section>

            {/* Section 5 */}
            <section id="sharing" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-navy-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-brand-600" />
                5. Information Sharing & Third Parties
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Your resume and application details are only shared with employers when you explicitly submit an application or enable public candidate discovery. We do not sell or rent contact data to marketers.
              </p>
            </section>

            {/* Section 6 */}
            <section id="rights" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-navy-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                6. Your Privacy Rights (GDPR & CCPA)
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Regardless of your geographic location, we provide full granular control over your profile:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-navy-900">
                  ✔ <strong>Right to Access:</strong> Request a complete export of stored account data.
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-navy-900">
                  ✔ <strong>Right to Rectification:</strong> Edit and update your profile details anytime.
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-navy-900">
                  ✔ <strong>Right to Erasure:</strong> Permanently delete your resume, account, and logs.
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-navy-900">
                  ✔ <strong>Right to Object:</strong> Opt-out of non-essential email notifications.
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="security" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-navy-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-brand-600" />
                7. Security & Encryption Standards
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                All platform communications are encrypted with TLS 1.3 / SSL. Passwords and credentials are cryptographic hashes using industry-standard bcrypt. Database backups are AES-256 encrypted at rest in high-availability ISO-27001 certified data centers.
              </p>
            </section>

            {/* Section 8 */}
            <section id="retention" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-navy-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-brand-600" />
                8. Data Retention & Deletion
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                We retain user account information as long as the account remains active. If you request account closure via your dashboard settings, all personal identifiers and uploaded resume documents are permanently expunged within 30 days.
              </p>
            </section>

            {/* Section 9 */}
            <section id="contact" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-navy-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-600" />
                9. Contact Data Protection Officer
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                If you have inquiries regarding this policy or wish to exercise your statutory rights, please reach out to our legal compliance office:
              </p>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-navy-900 space-y-1">
                <div><strong>Data Protection Officer (DPO)</strong></div>
                <div>Email: <a href="mailto:privacy@jobwala.com" className="text-brand-600 font-bold hover:underline">privacy@jobwala.com</a></div>
                <div>Address: MR. JOB WALA Legal Team, 100 Innovation Parkway, Suite 400, San Francisco, CA 94105</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
