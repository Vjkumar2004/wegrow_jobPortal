"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Building2,
  User,
  Mail,
  Phone,
  Calendar,
  Layers,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { RecruitmentPackage, PackageEnquirySubmission } from "@/types/packages";
import { CURRENT_TERMS_VERSION } from "@/constants/recruitmentTerms";
import { authService } from "@/services/auth.service";

interface ContactSalesModalProps {
  pkg: RecruitmentPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (submission: PackageEnquirySubmission) => void;
}

export const ContactSalesModal: React.FC<ContactSalesModalProps> = ({
  pkg,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    hiringVolume: "10-25 hires / quarter",
    hiringDomains: "Full-Stack & QA Engineering",
    timeline: "Immediate / Within 30 days",
    customNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<PackageEnquirySubmission | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessData(null);
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const hrCompany = (currentUser as any).hrProfile?.company?.name || "";
        const hrPerson =
          currentUser.name ||
          currentUser.fullName ||
          (currentUser as any).hrProfile?.fullName ||
          "";
        const hrEmail = currentUser.email || "";
        const hrPhone = (currentUser as any)?.phone || (currentUser as any)?.hrProfile?.phone || "";

        setFormData((prev) => ({
          ...prev,
          companyName: hrCompany || prev.companyName,
          contactPerson: hrPerson || prev.contactPerson,
          email: hrEmail || prev.email,
          phone: hrPhone || prev.phone,
        }));
      }
    }
  }, [isOpen]);

  if (!isOpen || !pkg) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.companyName.trim()) {
      setError("Please specify your company name.");
      return;
    }
    if (!formData.contactPerson.trim()) {
      setError("Please provide your contact person name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please provide a valid business email.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: PackageEnquirySubmission = {
        id: `sales-${Date.now()}`,
        packageId: "workforce-partner",
        packageName: "Workforce Partner (Dedicated Retainer)",
        packagePrice: "Custom Enterprise Pricing",
        companyName: formData.companyName.trim(),
        contactPerson: formData.contactPerson.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        jobRole: `Enterprise Hiring: ${formData.hiringDomains}`,
        vacancies: 10,
        jobLocation: "Pan India / Enterprise",
        requiredSkills: formData.hiringDomains,
        salaryRange: "Enterprise Band",
        additionalRequirements: `Volume: ${formData.hiringVolume}. Timeline: ${formData.timeline}. Notes: ${formData.customNotes}`,
        enquiryType: "sales_contact",
        status: "Submitted",
        createdAt: new Date().toISOString(),
        termsAcceptedVersion: CURRENT_TERMS_VERSION,
        termsAcceptedAt: new Date().toISOString(),
      };

      const res = await fetch("/api/recruitment-packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit enterprise consultation request.");
      }

      const created = data.enquiry || payload;

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("wegrow_active_recruitment_package", JSON.stringify(created));
          const existingEnquiries = JSON.parse(
            localStorage.getItem("wegrow_recruitment_enquiries") || "[]"
          );
          const updated = [created, ...existingEnquiries.filter((x: any) => x.id !== created.id)];
          localStorage.setItem("wegrow_recruitment_enquiries", JSON.stringify(updated));
          window.dispatchEvent(new CustomEvent("recruitment-package-updated", { detail: created }));
        } catch {}
      }

      setSuccessData(created);
      onSuccess(created);
    } catch (err: any) {
      setError(err?.message || "Failed to submit sales consultation request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-[#172554] text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[11px] font-bold uppercase tracking-wider mb-2 border border-orange-400/30">
            <Building2 className="w-3.5 h-3.5" />
            Enterprise Partnership
          </div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            Connect with WeGrow Enterprise Sales
          </h3>
          <p className="text-xs text-blue-100/80 mt-1 leading-relaxed">
            Discuss custom SLAs, dedicated recruitment coordinators, and volume hiring retainers tailored to your enterprise roadmap.
          </p>
        </div>

        {/* Modal Body */}
        {successData ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs border border-emerald-200">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-[#172554]">
                Enterprise Consultation Scheduled!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                Thank you! A dedicated WeGrow Senior Enterprise Partner will reach out to <strong className="text-slate-800">{successData.companyName}</strong> within 2 business hours.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Sales Reference ID:</span>
                <span className="font-mono font-bold text-slate-800">{successData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service Model:</span>
                <span className="font-semibold text-slate-800">Workforce Dedicated Partner</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact:</span>
                <span className="font-semibold text-slate-800">{successData.contactPerson}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#172554] hover:bg-[#0f172a] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Close &amp; Continue
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enterprise Company <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Hexagon Tech Labs"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Person &amp; Title <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g. Priya Nair (VP of Talent)"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Corporate Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="priya@company.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Direct Phone / Mobile
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 99887 76655"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Expected Hiring Volume
                </label>
                <select
                  value={formData.hiringVolume}
                  onChange={(e) => setFormData({ ...formData, hiringVolume: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition bg-white"
                >
                  <option value="5-10 hires / quarter">5 - 10 hires / quarter</option>
                  <option value="10-25 hires / quarter">10 - 25 hires / quarter</option>
                  <option value="25-50 hires / quarter">25 - 50 hires / quarter</option>
                  <option value="50+ enterprise bulk hiring">50+ Enterprise Bulk Hiring</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hiring Timeline
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition bg-white"
                >
                  <option value="Immediate / Within 30 days">Immediate / Within 30 days</option>
                  <option value="Within 60 days">Within 60 days</option>
                  <option value="Quarterly Ongoing Retainer">Quarterly Ongoing Retainer</option>
                  <option value="Annual Campus & Lateral Partnership">Annual Campus &amp; Lateral Partnership</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Roles / Domains
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.hiringDomains}
                  onChange={(e) => setFormData({ ...formData, hiringDomains: e.target.value })}
                  placeholder="e.g. Software Engineers, QA Automation, Data Analysts, Sales Leads"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Custom Requirements / SLA Objectives
              </label>
              <textarea
                rows={2}
                value={formData.customNotes}
                onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                placeholder="Share any specific volume goals, dedicated screening needs, or preferred schedule for a consultation call..."
                className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>NDA &amp; Enterprise Confidentiality Guaranteed</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#172554] hover:bg-[#0f172a] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    <>
                      <span>Contact Enterprise Sales</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

