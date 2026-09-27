import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Scale,
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  CreditCard,
  Ban,
  Download,
  Search,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState("acceptance");
  const [searchTerm, setSearchTerm] = useState("");

  const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms" },
    { id: "eligibility", title: "2. User Accounts & Eligibility" },
    { id: "candidates", title: "3. Candidate Code of Conduct" },
    { id: "employers", title: "4. Employer Job Posting Rules" },
    { id: "billing", title: "5. Pricing, Credits & Payments" },
    { id: "intellectual", title: "6. Intellectual Property" },
    { id: "prohibited", title: "7. Prohibited Platform Activities" },
    { id: "liability", title: "8. Disclaimers & Liability Limits" },
    { id: "disputes", title: "9. Governing Law & Arbitration" },
    { id: "changes", title: "10. Modifications to Agreement" },
  ];

  const handleDownload = () => {
    toast.success("Preparing printable Terms of Service...");
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
            <Scale className="w-4 h-4 text-brand-600" />
            Terms of Service & Usage Agreement
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-navy-950 tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Last Modified: <span className="font-semibold text-navy-900">September 2026</span> • Effective Immediately
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-navy-900 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition-all"
            >
              <Download className="w-4 h-4 text-brand-600" />
              Download / Print Terms
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Table of Contents */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4 no-print">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter terms topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:bg-white focus:border-brand-500 focus:outline-none transition-all"
                />
              </div>

              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Quick Navigation
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

            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 text-amber-950">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1.5 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Important Notice
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                By creating a candidate or employer profile, you legally agree to adhere to all recruitment fairness standards.
              </p>
            </div>
          </div>

          {/* Right Policy Document */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/40 text-navy-950 space-y-10 leading-relaxed">
            {/* Section 1 */}
            <section id="acceptance" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-navy-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-brand-600" />
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Welcome to <strong>MR. JOB WALA</strong>. These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "Candidate," or "Employer") and MR. JOB WALA regarding your access to and use of our web portal, API services, and associated mobile/web tools.
              </p>
              <p className="text-slate-600 text-sm sm:text-base">
                If you do not agree to these Terms in their entirety, you must immediately cease all access and utilization of the Platform.
              </p>
            </section>

            {/* Section 2 */}
            <section id="eligibility" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-navy-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                2. User Accounts & Eligibility
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                To create an account on MR. JOB WALA:
              </p>
              <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                <li>You must be at least 18 years of age or the age of legal majority in your jurisdiction.</li>
                <li>You must provide accurate, current, and truthful registration credentials.</li>
                <li>You are solely responsible for maintaining the confidentiality of your credentials and all activities occurring under your account.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="candidates" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-navy-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-600" />
                3. Candidate Code of Conduct
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Candidates agree to provide authentic educational background, employment history, and portfolio materials. Submitting fabricated resumes, impersonating another person, or attempting to game automated assessment rankings will result in immediate permanent banning.
              </p>
            </section>

            {/* Section 4 */}
            <section id="employers" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-navy-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Scale className="w-5 h-5 text-brand-600" />
                4. Employer Job Posting Rules
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Employers and Recruiters using MR. JOB WALA must adhere to the following anti-scam regulations:
              </p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-slate-700">
                <div>🚫 <strong>No Application or Interview Fees:</strong> Employers may never charge candidates fees for training, application review, or background checks.</div>
                <div>🚫 <strong>Zero False Representations:</strong> Job titles, compensation ranges, and location requirements must reflect genuine openings.</div>
                <div>🚫 <strong>No Multi-Level Marketing (MLM):</strong> Pyramid schemes, commission-only undisclosed setups, or unsolicited marketing are strictly prohibited.</div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="billing" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-navy-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-600" />
                5. Pricing, Credits & Payments
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Candidate services (searching, applying, resume building) are completely free. Employer posting subscriptions and featured listing credits are billed according to our published Pricing Plans. All payments are processed through secure PCI-compliant gateways.
              </p>
            </section>

            {/* Section 6 */}
            <section id="intellectual" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-navy-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-brand-600" />
                6. Intellectual Property
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                The MR. JOB WALA branding, logos, algorithms, user interface designs, and proprietary matching engines are the exclusive intellectual property of the company. You retain ownership of any resumes, logos, or content you upload.
              </p>
            </section>

            {/* Section 7 */}
            <section id="prohibited" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-navy-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Ban className="w-5 h-5 text-brand-600" />
                7. Prohibited Platform Activities
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                You agree not to engage in unauthorized data scraping, reverse engineering, distributing malware, harvesting candidate phone numbers for unsolicited robocalls, or interfering with system performance.
              </p>
            </section>

            {/* Section 8 */}
            <section id="liability" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-navy-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-brand-600" />
                8. Disclaimers & Liability Limits
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                The platform is provided on an "AS IS" and "AS AVAILABLE" basis. MR. JOB WALA does not guarantee that candidate applications will result in job offers, nor do we warrant the performance of hired candidates.
              </p>
            </section>

            {/* Section 9 */}
            <section id="disputes" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-navy-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Scale className="w-5 h-5 text-brand-600" />
                9. Governing Law & Arbitration
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                These terms are governed in accordance with the laws of the State of California, United States. Any disputes shall be resolved through confidential binding arbitration.
              </p>
            </section>

            {/* Section 10 */}
            <section id="changes" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-navy-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-600" />
                10. Modifications to Agreement
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                We reserve the right to revise these Terms at any time. Material changes will be accompanied by notification banners on your dashboard or via email at least 14 days prior to taking effect.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
