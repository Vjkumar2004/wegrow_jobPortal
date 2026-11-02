"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PackageCheck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { PackageEnquirySubmission } from "@/types/packages";

export const RecruitmentPackageWidget: React.FC = () => {
  const [activePackage, setActivePackage] = useState<PackageEnquirySubmission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPackageInfo = async () => {
      // 1. Try server API
      try {
        const res = await fetch("/api/recruitment-packages", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (isMounted && Array.isArray(json.enquiries) && json.enquiries.length > 0) {
            setActivePackage(json.enquiries[0]);
            setLoading(false);
            return;
          }
        }
      } catch {}

      // 2. Fallback to localStorage
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("wegrow_active_recruitment_package");
          if (stored && isMounted) {
            setActivePackage(JSON.parse(stored));
          }
        } catch {}
      }
      if (isMounted) setLoading(false);
    };

    fetchPackageInfo();

    const handleUpdate = (e: any) => {
      if (e.detail) {
        setActivePackage(e.detail);
      } else {
        fetchPackageInfo();
      }
    };

    window.addEventListener("recruitment-package-updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("recruitment-package-updated", handleUpdate);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#EEF1F7] p-5 shadow-2xs animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
        <div className="h-3 bg-slate-100 rounded w-2/3" />
      </div>
    );
  }

  // If HR has an active package enquiry
  if (activePackage) {
    const isRecommended = activePackage.packageId === "professional";

    return (
      <div className="relative overflow-hidden bg-white rounded-2xl border border-orange-200/90 p-4 sm:p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FF6B00] to-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <PackageCheck className="w-6 h-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-[#FF6B00] uppercase tracking-wider">
                  Active Recruitment Service
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {activePackage.status || "Requirements Received"}
                </span>
                {isRecommended && (
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-[#FFF0E6] text-[#FF6B00] text-[10px] font-bold border border-[#FFE0CC]">
                    Popular Tier
                  </span>
                )}
              </div>

              <h4 className="text-base font-bold text-[#0B1F4B] leading-tight">
                {activePackage.packageName} &bull; {activePackage.jobRole}
              </h4>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B7694] mt-1">
                <span>
                  Vacancies: <strong className="text-[#0B1F4B]">{activePackage.vacancies} Positions</strong>
                </span>
                <span>
                  Location: <strong className="text-[#0B1F4B]">{activePackage.jobLocation}</strong>
                </span>
                <span>
                  Enquiry ID: <span className="font-mono">{activePackage.id}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
            <Link
              href="/hr/packages"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#e05e00] transition shadow-xs flex items-center gap-1.5"
            >
              <span>Manage / Upgrade</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If no package enquiry submitted yet, show an inviting recruitment consultancy banner
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#FFF5EE] via-white to-[#F0F6FF] rounded-2xl border border-orange-200/70 p-4 sm:p-5 shadow-2xs hover:shadow-sm transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center shrink-0 border border-orange-200">
            <Sparkles className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-bold text-[#FF6B00] uppercase tracking-wider">
                WeGrow Recruitment Consultancy Wing
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                Available Now
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-[#0B1F4B]">
              Need pre-screened candidate profiles or complete end-to-end hiring assistance?
            </h4>
            <p className="text-xs text-[#6B7694] mt-0.5">
              Packages starting from ₹2,999 / vacancy with verified database access, phone screening &amp; interview coordination.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/hr/packages"
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#e05e00] transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Explore Consultancy Packages</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

