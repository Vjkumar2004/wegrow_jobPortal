"use client";

import React, { useState } from "react";
import { Check, Minus, Info } from "lucide-react";
import { ComparisonRow } from "@/types/packages";

const COMPARISON_DATA: ComparisonRow[] = [
  { service: "Job posting", standard: true, professional: true, endToEnd: true, workforcePartner: true },
  { service: "Resume sourcing", standard: true, professional: true, endToEnd: true, workforcePartner: true },
  { service: "Resume screening", standard: false, professional: true, endToEnd: true, workforcePartner: true },
  { service: "Phone screening", standard: false, professional: true, endToEnd: true, workforcePartner: true },
  { service: "Candidate interest check", standard: false, professional: true, endToEnd: true, workforcePartner: true },
  { service: "Shortlist preparation", standard: false, professional: true, endToEnd: true, workforcePartner: true },
  { service: "Interview scheduling", standard: false, professional: true, endToEnd: true, workforcePartner: true },
  { service: "Interview follow-up", standard: false, professional: false, endToEnd: true, workforcePartner: true },
  { service: "Offer follow-up", standard: false, professional: false, endToEnd: true, workforcePartner: true },
  { service: "Joining tracking", standard: false, professional: false, endToEnd: true, workforcePartner: true },
  { service: "Dedicated coordinator", standard: false, professional: false, endToEnd: false, workforcePartner: true },
  { service: "Monthly reports", standard: false, professional: false, endToEnd: false, workforcePartner: true },
];

export const PackageComparisonTable: React.FC = () => {
  const [selectedMobileTab, setSelectedMobileTab] = useState<"standard" | "professional" | "endToEnd" | "workforcePartner">("professional");

  const renderIcon = (included: boolean) => {
    if (included) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-2xs">
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 border border-slate-200">
        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
      </span>
    );
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Mobile Tab Selector for Quick Filtering */}
      <div className="block lg:hidden p-4 border-b border-slate-100 bg-slate-50/70">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Compare Package Matrix:
        </p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {[
            { id: "standard", label: "Standard (₹2,999)" },
            { id: "professional", label: "Professional (₹5,999)" },
            { id: "endToEnd", label: "End-to-End (₹12,000)" },
            { id: "workforcePartner", label: "Workforce Partner" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedMobileTab(tab.id as any)}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all text-center ${
                selectedMobileTab === tab.id
                  ? "bg-[#FF6B00] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop & Tablet Table (Responsive with Horizontal Scroll on small screens) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-700">
              <th className="py-4 px-6 text-sm font-bold text-[#172554] w-[32%] sticky left-0 bg-slate-50 z-10">
                Recruitment Services
              </th>
              <th className="py-4 px-4 text-center text-xs sm:text-sm font-bold text-[#172554] w-[17%]">
                <div>Standard</div>
                <div className="text-[11px] font-semibold text-slate-500">₹2,999 / vacancy</div>
              </th>
              <th className="py-4 px-4 text-center text-xs sm:text-sm font-bold text-[#FF6B00] w-[17%] bg-orange-50/50 border-x border-orange-100">
                <div className="flex items-center justify-center gap-1">
                  <span>Professional</span>
                  <span className="text-[10px] bg-[#FF6B00] text-white font-bold px-1.5 py-0.2 rounded-full">Rec</span>
                </div>
                <div className="text-[11px] font-semibold text-[#FF6B00]">₹5,999 / vacancy</div>
              </th>
              <th className="py-4 px-4 text-center text-xs sm:text-sm font-bold text-[#172554] w-[17%]">
                <div>End-to-End</div>
                <div className="text-[11px] font-semibold text-slate-500">₹12,000 / hire</div>
              </th>
              <th className="py-4 px-4 text-center text-xs sm:text-sm font-bold text-[#172554] w-[17%]">
                <div>Workforce Partner</div>
                <div className="text-[11px] font-semibold text-slate-500">Custom Retainer</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
            {COMPARISON_DATA.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-slate-50/80 transition-colors duration-150"
              >
                <td className="py-3.5 px-6 font-semibold text-slate-800 sticky left-0 bg-white z-10 border-r border-slate-100 shadow-2xs">
                  {row.service}
                </td>
                <td className="py-3.5 px-4 text-center">
                  {renderIcon(row.standard)}
                </td>
                <td className="py-3.5 px-4 text-center bg-orange-50/30 border-x border-orange-100/60">
                  {renderIcon(row.professional)}
                </td>
                <td className="py-3.5 px-4 text-center">
                  {renderIcon(row.endToEnd)}
                </td>
                <td className="py-3.5 px-4 text-center">
                  {renderIcon(row.workforcePartner)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend & Helper notes */}
      <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Check className="w-3 h-3 stroke-[2.5]" />
            </span>
            <span className="font-medium">Included in package</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200">
              <Minus className="w-3 h-3 stroke-[2.5]" />
            </span>
            <span className="font-medium">Not included</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>All packages are delivered by WeGrow Jobz dedicated recruitment consultants.</span>
        </div>
      </div>
    </div>
  );
};

