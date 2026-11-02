"use client";

import React from "react";
import { Check, Minus, Sparkles, Building2, ShieldCheck, ArrowRight } from "lucide-react";
import { RecruitmentPackage } from "@/types/packages";

interface PackageCardProps {
  pkg: RecruitmentPackage;
  onSelect: (pkg: RecruitmentPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, onSelect }) => {
  const isRecommended = Boolean(pkg.isPopular);
  const isEnterprise = pkg.id === "workforce-partner";

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl transition-all duration-300 ${
        isRecommended
          ? "bg-white border-2 border-[#FF6B00] shadow-[0_12px_40px_rgba(255,107,0,0.14)] lg:-translate-y-2 z-10 ring-4 ring-[#FF6B00]/10"
          : "bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300"
      }`}
    >
      {/* Recommended Tag */}
      {isRecommended && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#E05300] text-white text-xs font-bold tracking-wide uppercase shadow-md">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Recommended
          </span>
        </div>
      )}

      {/* Card Header & Pricing */}
      <div className="p-6 sm:p-7 border-b border-slate-100 flex-1">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="text-xl font-bold text-[#172554] tracking-tight">
              {pkg.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              {pkg.tagline}
            </p>
          </div>
          {isEnterprise && (
            <div className="p-2 rounded-xl bg-orange-50 text-[#FF6B00] shrink-0 border border-orange-100">
              <Building2 className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Pricing Display */}
        <div className="mt-5 mb-4">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                isRecommended ? "text-[#FF6B00]" : "text-[#172554]"
              }`}
            >
              {pkg.price}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-500">
              {pkg.unit}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{pkg.billingNote}</span>
          </p>
        </div>

        {/* Features List */}
        <div className="mt-6 space-y-3">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Included Services:
          </p>
          <ul className="space-y-2.5">
            {pkg.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                  <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                </span>
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Not Included Section for Standard Package */}
          {pkg.notIncluded && pkg.notIncluded.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Not Included:
              </p>
              <ul className="space-y-2">
                {pkg.notIncluded.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-400 line-through decoration-slate-300">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 border border-slate-200">
                      <Minus className="w-2.5 h-2.5 stroke-[2.5]" />
                    </span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-6 bg-slate-50/70 rounded-b-2xl border-t border-slate-100">
        <button
          type="button"
          onClick={() => onSelect(pkg)}
          className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm active:scale-[0.99] cursor-pointer ${
            isRecommended
              ? "bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-orange-500/25 hover:shadow-orange-500/40"
              : isEnterprise
              ? "bg-[#172554] hover:bg-[#0f172a] text-white shadow-slate-900/10 hover:shadow-slate-900/25"
              : "bg-white hover:bg-orange-50 text-[#172554] hover:text-[#FF6B00] border-2 border-slate-200 hover:border-[#FF6B00]"
          }`}
        >
          <span>{pkg.ctaText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

