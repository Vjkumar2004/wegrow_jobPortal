"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Layers,
  Headphones,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Clock,
  ArrowRight,
  Building2,
  Briefcase,
  HelpCircle,
  FileCheck,
  Lock,
} from "lucide-react";
import { RecruitmentPackage, PackageEnquirySubmission } from "@/types/packages";
import { PACKAGES_DATA } from "@/constants/recruitmentPackages";
import { CURRENT_TERMS_VERSION } from "@/constants/recruitmentTerms";
import { authService } from "@/services/auth.service";
import { PackageCard } from "./PackageCard";
import { PackageComparisonTable } from "./PackageComparisonTable";
import { RecruitmentWorkflow } from "./RecruitmentWorkflow";
import { HowItWorksSection } from "./HowItWorksSection";
import { PricingConditionsSection } from "./PricingConditionsSection";
import { PackageEnquiryModal } from "./PackageEnquiryModal";
import { ContactSalesModal } from "./ContactSalesModal";
import { SupportContactModal } from "./SupportContactModal";
import { MandatoryTermsModal } from "./MandatoryTermsModal";

interface RecruitmentPackagesClientProps {
  isHRLayout?: boolean;
}

export const RecruitmentPackagesClient: React.FC<RecruitmentPackagesClientProps> = ({
  isHRLayout = false,
}) => {
  const [packages, setPackages] = useState<RecruitmentPackage[]>(PACKAGES_DATA);
  const [selectedPackage, setSelectedPackage] = useState<RecruitmentPackage | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [recentSubmission, setRecentSubmission] = useState<PackageEnquirySubmission | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mandatory Terms & Conditions state
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);
  const [isCheckingTerms, setIsCheckingTerms] = useState<boolean>(true);

  const packagesSectionRef = useRef<HTMLDivElement>(null);

  // Check Terms acceptance on mount
  useEffect(() => {
    let isMounted = true;

    const verifyTermsAcceptance = async () => {
      const currentUser = authService.getCurrentUser();
      const storageKey = currentUser?.id
        ? `wegrow_terms_accepted_${currentUser.id}`
        : "wegrow_terms_accepted_guest";

      // 1. Fast local cache check
      if (typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem(storageKey);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.version === CURRENT_TERMS_VERSION) {
              if (isMounted) {
                setHasAcceptedTerms(true);
                setIsTermsModalOpen(false);
                setIsCheckingTerms(false);
              }
              return;
            }
          }
        } catch {}
      }

      // 2. Server API check
      try {
        const queryParams = new URLSearchParams();
        if (currentUser?.id) queryParams.set("userId", currentUser.id);
        if (currentUser?.email) queryParams.set("email", currentUser.email);
        const comp = (currentUser as any)?.hrProfile?.company?.name;
        if (comp) queryParams.set("companyName", comp);
        queryParams.set("version", CURRENT_TERMS_VERSION);

        const res = await fetch(`/api/recruitment-packages/terms?${queryParams.toString()}`, {
          cache: "no-store",
        });

        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            if (json.accepted) {
              setHasAcceptedTerms(true);
              setIsTermsModalOpen(false);
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  storageKey,
                  JSON.stringify({
                    version: CURRENT_TERMS_VERSION,
                    acceptedAt: json.record?.acceptedAt || new Date().toISOString(),
                  })
                );
              }
            } else {
              setHasAcceptedTerms(false);
              setIsTermsModalOpen(true);
            }
          }
        } else {
          // If server check fails, require acceptance for safety
          if (isMounted) {
            setHasAcceptedTerms(false);
            setIsTermsModalOpen(true);
          }
        }
      } catch {
        if (isMounted) {
          setHasAcceptedTerms(false);
          setIsTermsModalOpen(true);
        }
      } finally {
        if (isMounted) setIsCheckingTerms(false);
      }
    };

    verifyTermsAcceptance();

    const onTermsAcceptedEvent = (e: any) => {
      if (e.detail?.version === CURRENT_TERMS_VERSION && isMounted) {
        setHasAcceptedTerms(true);
        setIsTermsModalOpen(false);
      }
    };

    window.addEventListener("recruitment-terms-accepted", onTermsAcceptedEvent);
    return () => {
      isMounted = false;
      window.removeEventListener("recruitment-terms-accepted", onTermsAcceptedEvent);
    };
  }, []);

  // Load existing active package / submission from storage or API
  useEffect(() => {
    const loadStoredEnquiry = () => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("wegrow_active_recruitment_package");
          if (stored) {
            setRecentSubmission(JSON.parse(stored));
          }
        } catch {}
      }
    };

    loadStoredEnquiry();
    window.addEventListener("recruitment-package-updated", loadStoredEnquiry);
    return () => window.removeEventListener("recruitment-package-updated", loadStoredEnquiry);
  }, []);

  const handleSelectPackage = (pkg: RecruitmentPackage) => {
    // If terms not accepted yet, force terms modal first
    if (!hasAcceptedTerms) {
      setIsTermsModalOpen(true);
      return;
    }

    setSelectedPackage(pkg);
    if (pkg.id === "workforce-partner") {
      setIsSalesModalOpen(true);
    } else {
      setIsEnquiryModalOpen(true);
    }
  };

  const handleEnquirySuccess = (submission: PackageEnquirySubmission) => {
    setRecentSubmission(submission);
    setToastMessage(`Requirement for ${submission.packageName} received! Our team is preparing matching profiles.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  const scrollToPackages = () => {
    if (!hasAcceptedTerms) {
      setIsTermsModalOpen(true);
      return;
    }
    packagesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`min-h-screen bg-[#F8FAFC] text-[#172554] font-['Poppins',sans-serif] selection:bg-[#FF6B00] selection:text-white ${isHRLayout ? 'p-3.5 sm:p-6 lg:p-8' : 'pb-20'}`}>
      
      {/* Blurred background wrapper if terms have not yet been accepted */}
      <div className={`transition-all duration-300 ${!hasAcceptedTerms && !isCheckingTerms ? "filter blur-[6px] pointer-events-none select-none opacity-40" : ""}`}>
        <div className={`max-w-7xl mx-auto ${isHRLayout ? '' : 'px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12'}`}>
          
          {/* Floating Success Toast */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 bg-[#172554] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
            </div>
          )}

          {/* Existing Active Package Notice (if any) */}
          {recentSubmission && (
            <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-50 via-white to-blue-50 border border-orange-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
                      Active Enquiry Status
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {recentSubmission.status || "Submitted"}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-[#172554] mt-0.5">
                    {recentSubmission.packageName} &bull; {recentSubmission.jobRole} ({recentSubmission.vacancies} {recentSubmission.vacancies > 1 ? "vacancies" : "vacancy"})
                  </h4>
                  <p className="text-xs text-slate-500">
                    Company: <strong className="text-slate-700">{recentSubmission.companyName}</strong> &bull; Submitted on {new Date(recentSubmission.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSupportModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#172554] bg-white border border-slate-200 hover:border-[#FF6B00] transition cursor-pointer"
                >
                  Track with Desk
                </button>
                <button
                  type="button"
                  onClick={scrollToPackages}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#e05e00] transition shadow-xs cursor-pointer"
                >
                  Book Another Vacancy
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 3. PAGE HEADER                                                */}
          {/* ============================================================== */}
          <header className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-[#FF6B00] text-xs font-bold tracking-wide uppercase mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>WeGrow Dedicated Recruitment Wing</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#172554] tracking-tight leading-tight">
              Recruitment Consultancy Services
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal">
              &ldquo;Choose the right recruitment solution for your hiring needs. From candidate sourcing to complete recruitment management, WeGrow Jobz supports your hiring journey.&rdquo;
            </p>

            {/* Header Stats & Support Information */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                <Layers className="w-4 h-4 text-[#FF6B00]" />
                <span className="font-bold text-[#172554]">4 Flexible Packages</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-700">Dedicated Hiring Desk Support</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
                <span className="font-semibold text-slate-700">Verified &amp; Screened Talent</span>
              </div>

              <button
                type="button"
                onClick={() => setIsSupportModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#172554] hover:bg-[#0f172a] text-white font-bold transition shadow-xs cursor-pointer active:scale-98"
              >
                <Headphones className="w-4 h-4 text-[#FF6B00]" />
                <span>Contact Support</span>
              </button>
            </div>
          </header>

          {/* ============================================================== */}
          {/* 4. FOUR RECRUITMENT PACKAGES GRID                             */}
          {/* ============================================================== */}
          <section id="packages-grid" ref={packagesSectionRef} className="scroll-mt-24 mb-20">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
                Select Your Hiring Solution
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Transparent per-vacancy and performance-based hiring solutions built for HR leaders and fast-scaling teams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  onSelect={handleSelectPackage}
                />
              ))}
            </div>
          </section>

          {/* ============================================================== */}
          {/* 5. PACKAGE COMPARISON SECTION                                 */}
          {/* ============================================================== */}
          <section className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
                Full Feature Breakdown
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight mt-1">
                Package Comparison
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Compare features, screening depth, interview coordination, and coordinator access across our 4 recruitment solutions.
              </p>
            </div>

            <PackageComparisonTable />
          </section>

          {/* ============================================================== */}
          {/* 6. RECRUITMENT WORKFLOW SECTION                               */}
          {/* ============================================================== */}
          <section className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
                End-To-End Delivery Pipeline
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight mt-1">
                Recruitment Workflow
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                How our dedicated talent acquisition team seamlessly processes your corporate vacancies.
              </p>
            </div>

            <RecruitmentWorkflow />
          </section>

          {/* ============================================================== */}
          {/* 7. HOW IT WORKS SECTION                                       */}
          {/* ============================================================== */}
          <section className="mb-20">
            <HowItWorksSection />
          </section>

          {/* ============================================================== */}
          {/* 8. PRICING CONDITIONS SECTION                                 */}
          {/* ============================================================== */}
          <section className="mb-20">
            <PricingConditionsSection />
          </section>

          {/* ============================================================== */}
          {/* 9. CTA SECTION                                                */}
          {/* ============================================================== */}
          <section className="rounded-3xl bg-gradient-to-r from-[#172554] via-[#0E2963] to-[#172554] text-white p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden shadow-xl border border-blue-900/40">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#FF6B00]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-orange-300 text-xs font-bold uppercase tracking-wider border border-white/10">
                Get Started Today
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                Ready to Find the Right Talent?
              </h2>
              <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-2xl mx-auto">
                Let WeGrow Jobz simplify your recruitment process. Choose a package and let our recruitment team handle your hiring requirements.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={scrollToPackages}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white text-sm font-bold transition-all shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Explore Packages</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsSupportModalOpen(true)}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-all border border-white/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Headphones className="w-4 h-4 text-orange-300" />
                  <span>Contact Recruitment Team</span>
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* ============================================================== */}
      {/* MANDATORY TERMS & CONDITIONS POPUP MODAL                      */}
      {/* ============================================================== */}
      <MandatoryTermsModal
        isOpen={isTermsModalOpen}
        onAccepted={() => {
          setHasAcceptedTerms(true);
          setIsTermsModalOpen(false);
          setToastMessage("Terms & Conditions accepted. Consultancy packages unlocked.");
          setTimeout(() => setToastMessage(null), 5000);
        }}
        isHRLayout={isHRLayout}
      />

      {/* MODALS */}
      <PackageEnquiryModal
        pkg={selectedPackage}
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        onSuccess={handleEnquirySuccess}
      />

      <ContactSalesModal
        pkg={selectedPackage}
        isOpen={isSalesModalOpen}
        onClose={() => setIsSalesModalOpen(false)}
        onSuccess={handleEnquirySuccess}
      />

      <SupportContactModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        onSelectSales={() => {
          setSelectedPackage(packages.find((p) => p.id === "workforce-partner") || null);
          setIsSalesModalOpen(true);
        }}
      />
    </div>
  );
};
