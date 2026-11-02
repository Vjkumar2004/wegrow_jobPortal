"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Check,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Clock,
  ChevronRight,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import { PACKAGES_DATA } from "@/constants/recruitmentPackages";

export default function RecruitmentPackagesSection() {
  return (
    <section
      id="recruitment-packages"
      className="w-full py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#F8FAFD] via-white to-[#F8FAFD] border-t border-b border-[#EEF2F8] relative overflow-hidden"
    >
      {/* Background ambient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-20 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0E6] border border-[#FFE0CC] text-[#FF6B00] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Dedicated Recruitment Wing • Corporate Services</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#172554] tracking-tight leading-tight">
            Recruitment Consultancy Packages
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Choose the right recruitment solution for your hiring needs. From candidate sourcing to complete recruitment management, WeGrow Jobz supports your hiring journey.
          </p>

          {/* Quick Trust Highlights */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
              <span>Verified Candidate Profiles</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Fast 24-48h Sourcing Turnaround</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <Users className="w-4 h-4 text-[#1E5BE0]" />
              <span>Dedicated Recruiter Support</span>
            </span>
          </div>
        </div>

        {/* ================= 4 PACKAGES GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-12">
          {PACKAGES_DATA.map((pkg) => {
            const isRecommended = Boolean(pkg.isPopular);
            const isEnterprise = pkg.id === "workforce-partner";

            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-2xl transition-all duration-300 ${
                  isRecommended
                    ? "bg-white border-2 border-[#FF6B00] shadow-[0_12px_40px_rgba(255,107,0,0.12)] lg:-translate-y-2 z-10 ring-4 ring-[#FF6B00]/10"
                    : "bg-white border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-slate-300"
                }`}
              >
                {/* Popular Pill */}
                {isRecommended && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#E05300] text-white text-[11px] font-bold tracking-wide uppercase shadow-sm">
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      Recommended
                    </span>
                  </div>
                )}

                {/* Card Top & Pricing */}
                <div className="p-6 sm:p-7 border-b border-slate-100 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-[#172554] tracking-tight">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium leading-snug">
                        {pkg.tagline}
                      </p>
                    </div>
                    {isEnterprise && (
                      <div className="p-2 rounded-xl bg-orange-50 text-[#FF6B00] shrink-0 border border-orange-100">
                        <Building2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-5 mb-4">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                          isRecommended ? "text-[#FF6B00]" : "text-[#172554]"
                        }`}
                      >
                        {pkg.price}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {pkg.unit}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">
                      {pkg.billingNote}
                    </p>
                  </div>

                  {/* Features list (top 5 key features) */}
                  <div className="mt-6 space-y-2.5">
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Included Services:
                    </p>
                    <ul className="space-y-2">
                      {pkg.features.slice(0, 5).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-snug">
                          <span className="mt-0.5 w-3.5 h-3.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                            <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                      {pkg.features.length > 5 && (
                        <li className="text-[11px] font-bold text-[#FF6B00] pt-1">
                          + {pkg.features.length - 5} more inclusions...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Card CTA Footer */}
                <div className="p-5 sm:p-6 bg-slate-50/60 rounded-b-2xl border-t border-slate-100">
                  <Link
                    href={`/recruitment-services#packages-grid`}
                    className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-2xs active:scale-[0.99] ${
                      isRecommended
                        ? "bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-orange-500/25 hover:shadow-orange-500/40"
                        : isEnterprise
                        ? "bg-[#172554] hover:bg-[#0f172a] text-white shadow-slate-900/10 hover:shadow-slate-900/25"
                        : "bg-white hover:bg-orange-50 text-[#172554] hover:text-[#FF6B00] border border-slate-300 hover:border-[#FF6B00]"
                    }`}
                  >
                    <span>{pkg.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= BOTTOM ACTION BAR ================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-orange-100/70 text-[#FF6B00] items-center justify-center shrink-0 border border-orange-200/70">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#172554]">
                Looking for detailed package comparisons or customized bulk hiring?
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Review the complete 12-point service matrix, our 7-step recruitment workflow, and clear legal engagement terms.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/recruitment-services"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#172554] hover:bg-[#0f172a] transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span>View Full Comparison &amp; Workflow</span>
              <ChevronRight className="w-4 h-4 text-orange-400" />
            </Link>

            <Link
              href="/recruitment-services"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#FF6B00] bg-orange-50 hover:bg-orange-100 border border-orange-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore All Packages</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

