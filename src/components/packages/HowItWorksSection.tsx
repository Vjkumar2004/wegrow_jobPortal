"use client";

import React from "react";
import { CheckCircle, ArrowRight, ShieldCheck, Zap } from "lucide-react";

const STEPS = [
  {
    num: "1",
    title: "Select your recruitment package",
    desc: "Choose from Standard, Professional, End-to-End, or Workforce Partner tailored to your vacancy volume and support requirements.",
  },
  {
    num: "2",
    title: "Submit your job requirements",
    desc: "Share your job role, mandatory skills, location preference, experience band, and budget in our simple intake form.",
  },
  {
    num: "3",
    title: "Our recruitment team starts working",
    desc: "Our seasoned talent consultants tap into our extensive database and active sourcing channels to evaluate matching candidates.",
  },
  {
    num: "4",
    title: "Review shortlisted candidate profiles",
    desc: "Receive pre-screened, verified candidate profiles with detailed recruiter notes and interview readiness metrics.",
  },
  {
    num: "5",
    title: "Complete interviews and hiring",
    desc: "Conduct final rounds with our scheduling support and close hires with full onboarding coordination.",
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-br from-white via-orange-50/20 to-slate-50/50 rounded-2xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-sm">
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/70 text-[#FF6B00] text-xs font-bold tracking-wide uppercase mb-3">
          <Zap className="w-3.5 h-3.5" />
          Streamlined Process
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-[#172554] tracking-tight">
          How It Works
        </h3>
        <p className="text-sm text-slate-600 mt-2">
          From enquiry to successful placement, our structured model keeps your hiring fast, transparent, and hassle-free.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 relative">
        {STEPS.map((step, idx) => (
          <div
            key={idx}
            className="flex flex-col bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs hover:border-[#FF6B00] hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-full bg-[#172554] text-white text-sm font-bold flex items-center justify-center">
                {step.num}
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <h4 className="text-sm font-bold text-[#172554] mb-1.5 leading-snug">
              {step.title}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Assurance note */}
      <div className="mt-8 pt-5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
          <span className="font-semibold text-slate-700">
            Dedicated recruitment specialists assignable within 24 hours of enquiry.
          </span>
        </div>
        <span className="text-slate-500 text-[11px]">
          No hidden onboarding fees. Clear deliverables upfront.
        </span>
      </div>
    </div>
  );
};

