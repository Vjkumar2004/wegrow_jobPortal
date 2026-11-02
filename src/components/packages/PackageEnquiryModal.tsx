"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Building,
  User,
  Mail,
  Phone,
  Briefcase,
  Users,
  MapPin,
  Code,
  IndianRupee,
  FileEdit,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { RecruitmentPackage, PackageEnquirySubmission } from "@/types/packages";
import { CURRENT_TERMS_VERSION } from "@/constants/recruitmentTerms";
import { authService } from "@/services/auth.service";

interface PackageEnquiryModalProps {
  pkg: RecruitmentPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (submission: PackageEnquirySubmission) => void;
}

export const PackageEnquiryModal: React.FC<PackageEnquiryModalProps> = ({
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
    jobRole: "",
    vacancies: "1",
    jobLocation: "",
    requiredSkills: "",
    salaryRange: "₹4 LPA - ₹7 LPA",
    additionalRequirements: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<PackageEnquirySubmission | null>(null);

  // Auto-fill from logged-in HR session if available
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

    // Validation
    if (!formData.companyName.trim()) {
      setError("Please provide your Company Name.");
      return;
    }
    if (!formData.contactPerson.trim()) {
      setError("Please provide the Contact Person name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please enter a valid official email address.");
      return;
    }
    if (!formData.jobRole.trim()) {
      setError("Please provide the primary Job Role you are hiring for.");
      return;
    }
    const vacNum = parseInt(formData.vacancies, 10);
    if (isNaN(vacNum) || vacNum < 1) {
      setError("Vacancies count must be at least 1.");
      return;
    }
    if (!formData.jobLocation.trim()) {
      setError("Please provide the Job Location or select Remote/Hybrid.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: PackageEnquirySubmission = {
        id: `rpkg-${Date.now()}`,
        packageId: pkg.id,
        packageName: pkg.name,
        packagePrice: pkg.price,
        companyName: formData.companyName.trim(),
        contactPerson: formData.contactPerson.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        jobRole: formData.jobRole.trim(),
        vacancies: vacNum,
        jobLocation: formData.jobLocation.trim(),
        requiredSkills: formData.requiredSkills.trim() || "As per job role",
        salaryRange: formData.salaryRange.trim(),
        additionalRequirements: formData.additionalRequirements.trim(),
        enquiryType: "package_selection",
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
        throw new Error(data.error || "Failed to submit recruitment requirement.");
      }

      const created = data.enquiry || payload;

      // Also persist to localStorage for instant UI reactivity across the platform
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
      setError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#172554] to-[#0E2963] text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B00] text-white text-[11px] font-bold uppercase tracking-wider">
              {pkg.name}
            </span>
            <span className="text-white/80 text-xs font-semibold">
              {pkg.price} {pkg.unit}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            Confirm Package &amp; Submit Hiring Requirements
          </h3>
          <p className="text-xs text-blue-100/80 mt-1 max-w-lg leading-relaxed">
            Fill in your vacancy details. Our WeGrow recruitment team will immediately initiate candidate sourcing and screening.
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
                Requirement Submitted Successfully!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                Thank you! Your hiring enquiry for <strong className="text-slate-800">{successData.packageName}</strong> ({successData.jobRole}) has been assigned to our recruitment desk.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-left max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Enquiry ID:</span>
                <span className="font-mono font-bold text-slate-800">{successData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Company:</span>
                <span className="font-semibold text-slate-800">{successData.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vacancies:</span>
                <span className="font-semibold text-slate-800">{successData.vacancies} Positions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                  {successData.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Our recruitment coordinator will connect with you within 2-4 business hours to finalize profiles.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Close &amp; View Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Row 1: Company Name & Contact Person */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Acme Tech Solutions"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Person <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g. Ramesh Kumar (HR Lead)"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Official Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="hr@company.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Job Role & Number of Vacancies */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Job Role / Title <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.jobRole}
                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                    placeholder="e.g. Senior React Developer, Sales Executive"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vacancies <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.vacancies}
                    onChange={(e) => setFormData({ ...formData, vacancies: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"
                  />
                </div>
              </div>
            </div>

            {/* Row 4: Job Location & Salary Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Job Location <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.jobLocation}
                    onChange={(e) => setFormData({ ...formData, jobLocation: e.target.value })}
                    placeholder="e.g. Bangalore, Chennai, or Remote"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Salary Budget Range
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.salaryRange}
                    onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                    placeholder="e.g. ₹3 - 6 LPA, ₹8 - 12 LPA"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"
                  />
                </div>
              </div>
            </div>

            {/* Row 5: Required Skills */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Required Skills &amp; Qualifications
              </label>
              <div className="relative">
                <Code className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.requiredSkills}
                  onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                  placeholder="e.g. React.js, TypeScript, Next.js, Node.js, 2+ yrs experience"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"
                />
              </div>
            </div>

            {/* Row 6: Additional Requirements */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Additional Requirements / Notes for Recruiter
              </label>
              <div className="relative">
                <FileEdit className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  rows={2}
                  value={formData.additionalRequirements}
                  onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                  placeholder="Immediate joiners preferred, notice period limit, interview format (virtual/in-person)..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"
                />
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Enquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Hiring Requirement</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

