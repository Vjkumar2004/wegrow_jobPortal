"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  XCircle,
  Building2,
  Lock,
  ChevronDown,
  Loader2,
  Sparkles,
} from "lucide-react";
import { RECRUITMENT_TERMS_CLAUSES, CURRENT_TERMS_VERSION } from "@/constants/recruitmentTerms";
import { authService } from "@/services/auth.service";

interface MandatoryTermsModalProps {
  isOpen: boolean;
  onAccepted: () => void;
  isHRLayout?: boolean;
}

export const MandatoryTermsModal: React.FC<MandatoryTermsModalProps> = ({
  isOpen,
  onAccepted,
  isHRLayout = false,
}) => {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Trap Escape key so user cannot bypass
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown, true);
    }
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 35) {
      setHasScrolledToBottom(true);
    }
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
      setHasScrolledToBottom(true);
    }
  };

  const handleDecline = () => {
    // If declined, redirect away from consultancy packages
    if (isHRLayout) {
      router.push("/hr/dashboard");
    } else {
      router.push("/");
    }
  };

  const handleAccept = async () => {
    if (!agreed) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const currentUser = authService.getCurrentUser();
      const payload = {
        userId: currentUser?.id || "",
        userName: currentUser?.name || currentUser?.fullName || "HR Partner",
        userEmail: currentUser?.email || "",
        companyName: (currentUser as any)?.hrProfile?.company?.name || "Corporate Client",
        companyId: (currentUser as any)?.hrProfile?.company?.id || "",
        termsVersion: CURRENT_TERMS_VERSION,
      };

      // 1. Post to backend terms acceptance audit log
      const res = await fetch("/api/recruitment-packages/terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to record terms acceptance.");
      }

      // 2. Persist in local storage for fast client caching
      if (typeof window !== "undefined") {
        const storageKey = currentUser?.id
          ? `wegrow_terms_accepted_${currentUser.id}`
          : "wegrow_terms_accepted_guest";
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            version: CURRENT_TERMS_VERSION,
            acceptedAt: new Date().toISOString(),
          })
        );
        window.dispatchEvent(
          new CustomEvent("recruitment-terms-accepted", {
            detail: { version: CURRENT_TERMS_VERSION },
          })
        );
      }

      onAccepted();
    } catch (err: any) {
      setErrorMessage(err?.message || "An error occurred while saving your acceptance.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-[#0B1F4B]/80 backdrop-blur-md animate-in fade-in duration-300"
      style={{ isolation: "isolate" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-[0_25px_60px_rgba(11,31,75,0.35)] border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* ================= MODAL HEADER ================= */}
        <div className="bg-gradient-to-r from-[#172554] via-[#0E2963] to-[#172554] text-white p-5 sm:p-6 border-b border-blue-900/40 shrink-0 relative">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B00]/20 text-orange-300 border border-[#FF6B00]/40 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Mandatory Service Agreement</span>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300">
              v{CURRENT_TERMS_VERSION}
            </span>
          </div>

          <h2 id="terms-modal-title" className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Recruitment Consultancy Terms &amp; Conditions
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 leading-relaxed">
            Please carefully review the legal scope, employer obligations, and post-joining responsibilities before accessing WeGrow Jobz consultancy packages.
          </p>
        </div>

        {/* ================= SCROLLABLE TERMS BODY ================= */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 overscroll-contain divide-y divide-slate-100"
          style={{ scrollBehavior: "smooth" }}
        >
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="pb-3 text-xs text-slate-600 leading-relaxed bg-orange-50/70 p-3.5 rounded-2xl border border-orange-200/80">
            <p className="font-semibold text-slate-800">
              Notice to Hiring Managers &amp; Corporate Recruiters:
            </p>
            <p className="mt-1">
              By engaging WeGrow Jobz recruitment consultancy services, your organization acknowledges and agrees to adhere strictly to the following 7 operational and legal stipulations.
            </p>
          </div>

          {/* 7 CLAUSES */}
          {RECRUITMENT_TERMS_CLAUSES.map((clause) => (
            <div
              key={clause.number}
              className={`pt-4 first:pt-0 ${
                clause.isCrucial ? "p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 mt-2" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    clause.isCrucial
                      ? "bg-[#FF6B00] text-white shadow-2xs"
                      : "bg-[#172554] text-white"
                  }`}
                >
                  {clause.number}
                </span>

                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-[#172554]">
                      {clause.number}. {clause.title}
                    </h4>
                    {clause.isCrucial && (
                      <span className="px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200">
                        Critical Responsibility Clause
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-700 font-medium mt-1.5 leading-relaxed">
                    {clause.content}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Scroll bottom helper notice */}
          {!hasScrolledToBottom && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={scrollToBottom}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B00] hover:text-[#e05e00] transition cursor-pointer"
              >
                <span>Scroll to end of agreement</span>
                <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
              </button>
            </div>
          )}
        </div>

        {/* ================= FIXED FOOTER ================= */}
        <div className="p-4 sm:p-5 bg-slate-50/90 border-t border-slate-200 shrink-0 space-y-3">
          {/* Mandatory Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#FF6B00] focus:ring-[#FF6B00] focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-xs sm:text-[13px] font-bold text-[#172554] leading-snug group-hover:text-[#FF6B00] transition-colors">
              I have read and agree to the Terms &amp; Conditions.
            </span>
          </label>

          {/* Action Buttons: Decline vs Accept */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleDecline}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-4 h-4 text-slate-500" />
              <span>Decline &amp; Exit</span>
            </button>

            <button
              type="button"
              disabled={!agreed || isSubmitting}
              onClick={handleAccept}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                agreed && !isSubmitting
                  ? "bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-orange-500/25 cursor-pointer active:scale-98"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Recording Acceptance...</span>
                </>
              ) : (
                <>
                  <span>Accept &amp; Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

