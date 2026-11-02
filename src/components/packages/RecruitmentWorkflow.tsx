"use client";

import React from "react";
import {
  FileText,
  Search,
  PackageCheck,
  Cpu,
  UserCheck,
  CalendarCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface StepItem {
  number: number;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const WORKFLOW_STEPS: StepItem[] = [
  {
    number: 1,
    title: "Company Enquiry",
    desc: "HR submits hiring requirements.",
    icon: FileText,
  },
  {
    number: 2,
    title: "Requirement Analysis",
    desc: "WeGrow collects job role, skills, experience, salary, location and vacancy details.",
    icon: Search,
  },
  {
    number: 3,
    title: "Package Selection",
    desc: "HR selects a suitable recruitment package.",
    icon: PackageCheck,
  },
  {
    number: 4,
    title: "Recruitment Execution",
    desc: "WeGrow recruitment team starts candidate sourcing and screening based on the selected package.",
    icon: Cpu,
  },
  {
    number: 5,
    title: "Candidate Shortlisting",
    desc: "Suitable candidate profiles are shared with HR.",
    icon: UserCheck,
  },
  {
    number: 6,
    title: "Interview & Selection",
    desc: "Interview coordination and follow-up according to the package.",
    icon: CalendarCheck,
  },
  {
    number: 7,
    title: "Hiring Closure",
    desc: "Offer, joining and service closure are tracked as applicable.",
    icon: CheckCircle2,
  },
];

export const RecruitmentWorkflow: React.FC = () => {
  return (
    <div className="w-full">
      {/* Desktop & Tablet Connected Grid */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 lg:gap-3">
          {WORKFLOW_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === WORKFLOW_STEPS.length - 1;

            return (
              <div
                key={step.number}
                className="group relative flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#FF6B00]/40 transition-all duration-300"
              >
                {/* Step Pill */}
                <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-orange-50 text-[#FF6B00] border border-orange-200 group-hover:bg-[#FF6B00] group-hover:text-white transition-all duration-300 mb-3 shadow-2xs">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>

                {/* Step badge */}
                <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-2">
                  Step 0{step.number}
                </span>

                <h4 className="text-xs sm:text-sm font-bold text-[#172554] group-hover:text-[#FF6B00] transition-colors leading-tight mb-1.5">
                  {step.title}
                </h4>

                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-normal">
                  {step.desc}
                </p>

                {/* Desktop Arrow Connector */}
                {!isLast && (
                  <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 text-slate-300 pointer-events-none">
                    <ArrowRight className="w-4 h-4 text-slate-300 stroke-[2]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

