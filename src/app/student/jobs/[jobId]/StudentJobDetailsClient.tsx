"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Job } from "@/types";
import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  Briefcase,
  Monitor,
  Tag,
  Bookmark,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Code2,
  Gift,
  ExternalLink,
  Clock,
  Sparkles,
  Building2,
  Users2,
  ChevronRight,
  Check,
  X,
  AlertCircle
} from "lucide-react";
import { applicationsService } from "@/services/applications.service";
import { studentService } from "@/services/student.service";
import { jobsService } from "@/services/jobs.service";
import { getCompanyLogoUrl, getCompanyLogoProxyUrl } from "@/lib/utils";

interface StudentJobDetailsClientProps {
  job: Job;
  similarJobs?: Job[];
}

export default function StudentJobDetailsClient({
  job,
  similarJobs = [],
}: StudentJobDetailsClientProps) {
  const router = useRouter();

  // Destructure hasApplied & applicationId from job
  const { hasApplied, applicationId: initialAppId } = job;

  // State
  const [activeTab, setActiveTab] = useState<string>("details");
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        if (localStorage.getItem(`applied_job_${job.id}`) === "true") return true;
      } catch {}
    }
    return Boolean(hasApplied);
  });
  const [applicationId, setApplicationId] = useState<string | undefined>(initialAppId);

  const markApplied = (appId?: string) => {
    setIsApplied(true);
    if (appId) setApplicationId(appId);
    try { localStorage.setItem(`applied_job_${job.id}`, "true"); } catch {}
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStickyHeaderVisible, setIsStickyHeaderVisible] = useState(false);
  const [studentProfile, setStudentProfile] = useState<{
    fullName: string;
    degree?: string;
    institution?: string;
    email?: string;
  } | null>(null);

  // Check saved and applied status directly from backend APIs & fetch student profile
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      studentService.getSavedJobs().catch(() => []),
      applicationsService.getStudentApplications().catch(() => []),
      studentService.getProfile().catch(() => null),
      jobsService.getJobById(job.id).catch(() => null),
    ]).then(([savedList, applicationsList, profile, freshJob]) => {
      if (!isMounted) return;
      if (freshJob?.hasApplied) {
        markApplied(freshJob.applicationId || undefined);
      }
      if (Array.isArray(savedList) && savedList.some((sj) => sj.id === job.id)) {
        setIsSaved(true);
      }
      if (Array.isArray(applicationsList)) {
        const found = applicationsList.find((app) => app.jobId === job.id);
        if (found) {
          markApplied(found.id);
        }
      }
      if (profile) {
        const edu = (profile as any).educations?.[0] || profile.education?.[0];
        setStudentProfile({
          fullName: (profile as any).fullName || profile.name || "Student",
          degree: edu?.degree ? `${edu.degree}${edu.institution ? ` - ${edu.institution}` : ""}` : undefined,
          email: profile.email || undefined,
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, [job.id]);

  // Handle sticky header on scroll & scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setIsStickyHeaderVisible(scrollPos > 300);

      // Scroll Spy for tabs
      const sections = ["details", "about", "similar"];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180 && rect.bottom >= 120) {
            setActiveTab(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show auto-dismiss toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Toggle Save/Bookmark via backend API
  const handleToggleSave = async () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    if (nextSaved) {
      const success = await studentService.saveJob(job.id);
      if (success) {
        triggerToast("Job saved to your bookmarks");
      } else {
        setIsSaved(false);
        triggerToast("Failed to save job");
      }
    } else {
      const success = await studentService.removeSavedJob(job.id);
      if (success) {
        triggerToast("Job removed from bookmarks");
      } else {
        setIsSaved(true);
        triggerToast("Failed to remove bookmark");
      }
    }
  };

  // Tab click smooth scroll
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const element = document.getElementById(tabId);
    if (element) {
      const yOffset = -140;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Confirm Apply via Backend API
  const handleConfirmApply = async () => {
    setIsSubmitting(true);
    try {
      const res = await applicationsService.applyToJob(job.id, {
        fullName: studentProfile?.fullName || "Candidate",
        coverNote: "Application submitted via WeGrow Student Campus Portal.",
      });

      if (res.success) {
        markApplied(res.data?.id);
        setApplyModalOpen(false);
        triggerToast("Application submitted successfully! Track it in My Applications.");
      } else if (res.message?.toLowerCase().includes("already applied") || res.message?.toLowerCase().includes("already exists")) {
        markApplied();
        setApplyModalOpen(false);
        triggerToast("You have already applied for this job.");
      } else {
        triggerToast(res.message || "Failed to submit application. Please try again.");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to submit application. Please try again.";
      triggerToast(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format real salary string
  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      const minLPA = (job.salaryMin / 100000).toLocaleString("en-IN", { maximumFractionDigits: 1 });
      const maxLPA = (job.salaryMax / 100000).toLocaleString("en-IN", { maximumFractionDigits: 1 });
      return `₹${minLPA} - ₹${maxLPA} LPA`;
    }
    if (job.salaryMin) {
      const minLPA = (job.salaryMin / 100000).toLocaleString("en-IN", { maximumFractionDigits: 1 });
      return `₹${minLPA} LPA+`;
    }
    return "Not Disclosed";
  };

  const formattedSalary = formatSalary();
  const displaySimilar = similarJobs;

  return (
    <div className="relative pb-24 lg:pb-16 font-['Poppins',sans-serif] text-[#0B1F4B]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0B1F4B] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#22B573]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Compact Job Header on Scroll */}
      <div
        className={`fixed top-[66px] left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EEF1F7] px-4 lg:px-8 py-3 transition-all duration-300 shadow-sm ${
          isStickyHeaderVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-lg border border-[#EEF1F7] bg-white p-1 flex items-center justify-center shrink-0">
              {(job.company.logo || job.company.id) ? (
                <img
                  src={getCompanyLogoUrl(job.company, job.company.id)}
                  alt={job.company.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    const proxyUrl = job.company.id ? getCompanyLogoProxyUrl(job.company.id) : "";
                    if (proxyUrl && !target.dataset.tried && target.src !== proxyUrl) {
                      target.dataset.tried = "true";
                      target.src = proxyUrl;
                      return;
                    }
                    target.style.display = "none";
                  }}
                />
              ) : (
                <Building2 className="w-5 h-5 text-[#1E5BE0]" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#0B1F4B] truncate">
                {job.title}
              </h3>
              <p className="text-xs text-[#6B7694] truncate">
                {job.company.name} • {job.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleToggleSave}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                isSaved
                  ? "bg-[#1E5BE0] border-[#1E5BE0] text-white shadow-sm"
                  : "bg-white border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#E3EEFF]"
              }`}
              aria-label="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
            </button>

            {isApplied ? (
              <button
                disabled
                className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-[#22B573] text-white cursor-not-allowed shadow-none"
              >
                Already Applied ✓
              </button>
            ) : (
              <button
                onClick={() => setApplyModalOpen(true)}
                className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md bg-[#FF6B00] hover:bg-[#E86100] text-white hover:shadow-orange-500/25 cursor-pointer"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {/* 1. Back link */}
        <div className="mb-5">
          <Link
            href="/student/jobs"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#0B1F4B] hover:text-[#1E5BE0] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#0B1F4B] group-hover:text-[#1E5BE0]" />
            <span>Back to all jobs</span>
          </Link>
        </div>

        {/* 2. Job Header Card */}
        <div className="bg-white rounded-[16px] border border-[#EEF1F7] p-5 sm:p-6 lg:p-7 shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-[0_8px_20px_rgba(11,31,75,0.08)] transition-all duration-200">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start gap-5 min-w-0">
              {/* Company Logo Tile */}
              <div className="w-[84px] h-[84px] sm:w-[104px] sm:h-[104px] rounded-[12px] border border-[#EEF1F7] bg-white p-2.5 flex items-center justify-center shrink-0 shadow-sm">
                {(job.company.logo || job.company.id) ? (
                  <img
                    src={getCompanyLogoUrl(job.company, job.company.id)}
                    alt={job.company.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      const proxyUrl = job.company.id ? getCompanyLogoProxyUrl(job.company.id) : "";
                      if (proxyUrl && !target.dataset.tried && target.src !== proxyUrl) {
                        target.dataset.tried = "true";
                        target.src = proxyUrl;
                        return;
                      }
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-[#1E5BE0]" />
                )}
              </div>

              {/* Title, Badges, Company line */}
              <div className="min-w-0">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#E5F8EE] text-[#1E9E63] border border-[#BFEAD3]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E9E63]" />
                    Verified Company
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#E3EEFF] text-[#1E5BE0] border border-[#BBD3FA]">
                    <Sparkles className="w-3.5 h-3.5 text-[#1E5BE0]" />
                    {job.experience || "Fresher Friendly"}
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#FFF1E3] text-[#E8650A] border border-[#FFD2A8]">
                    <Tag className="w-3.5 h-3.5 text-[#E8650A]" />
                    {job.jobType} • {job.workMode}
                  </span>
                </div>

                {/* Job Title */}
                <h1 className="text-2xl sm:text-[30px] lg:text-[32px] font-extrabold text-[#0B1F4B] leading-tight tracking-tight line-clamp-2">
                  {job.title}
                </h1>

                {/* Company line */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[16px] font-semibold text-[#1E5BE0]">
                    {job.company.name}
                  </span>
                  <span className="w-4 h-4 rounded-full bg-[#E5F8EE] text-[#22B573] flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                </div>
              </div>
            </div>

            {/* Right side: Bookmark + Apply button */}
            <div className="flex items-center gap-3 shrink-0 self-start w-full sm:w-auto mt-2 lg:mt-0">
              <button
                onClick={handleToggleSave}
                className={`w-[44px] h-[44px] rounded-[10px] border-[1.5px] border-[#1E5BE0] flex items-center justify-center transition-all cursor-pointer ${
                  isSaved
                    ? "bg-[#1E5BE0] text-white shadow-sm"
                    : "bg-white text-[#1E5BE0] hover:bg-[#E3EEFF]"
                }`}
                aria-label="Bookmark Job"
                title={isSaved ? "Saved" : "Save Job"}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? "fill-white text-white" : "text-[#1E5BE0]"}`} />
              </button>

              {isApplied ? (
                <button
                  disabled
                  className="flex-1 sm:flex-initial h-[44px] px-6 rounded-[10px] text-[15px] font-semibold bg-[#22B573] text-white cursor-not-allowed shadow-none flex items-center justify-center gap-2"
                >
                  Already Applied ✓
                </button>
              ) : (
                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="flex-1 sm:flex-initial h-[44px] px-6 rounded-[10px] text-[15px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(255,107,0,0.25)] hover:shadow-[0_6px_20px_rgba(255,107,0,0.35)] bg-[#FF6B00] text-white hover:bg-[#E86100] active:scale-[0.98]"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#EEF1F7] my-6" />

          {/* 5-Column Info Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {/* Location */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] flex items-center justify-center shrink-0 text-[#1E5BE0]">
                <MapPin className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <span className="block text-[12px] text-[#6B7694] leading-tight">Location</span>
                <span className="block text-[14px] font-bold text-[#0B1F4B] truncate">
                  {job.location}
                </span>
              </div>
            </div>

            {/* Salary / Stipend */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] flex items-center justify-center shrink-0 text-[#1E5BE0]">
                <IndianRupee className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <span className="block text-[12px] text-[#6B7694] leading-tight">Salary / Stipend</span>
                <span className="block text-[14px] font-bold text-[#0B1F4B] truncate">
                  {formattedSalary}
                </span>
              </div>
            </div>

            {/* Experience */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] flex items-center justify-center shrink-0 text-[#1E5BE0]">
                <Briefcase className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <span className="block text-[12px] text-[#6B7694] leading-tight">Experience</span>
                <span className="block text-[14px] font-bold text-[#0B1F4B] truncate">
                  {job.experience}
                </span>
              </div>
            </div>

            {/* Work Mode */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] flex items-center justify-center shrink-0 text-[#1E5BE0]">
                <Monitor className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <span className="block text-[12px] text-[#6B7694] leading-tight">Work Mode</span>
                <span className="block text-[14px] font-bold text-[#0B1F4B] truncate">
                  {job.workMode}
                </span>
              </div>
            </div>

            {/* Job Type */}
            <div className="flex items-center gap-3.5 col-span-2 md:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] flex items-center justify-center shrink-0 text-[#1E5BE0]">
                <Tag className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <span className="block text-[12px] text-[#6B7694] leading-tight">Job Type</span>
                <span className="block text-[14px] font-bold text-[#0B1F4B] truncate">
                  {job.jobType}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Real Navigation Tabs */}
        <div className="mt-6 bg-white rounded-[14px] border border-[#EEF1F7] p-1 flex items-center gap-2 overflow-x-auto shadow-sm no-scrollbar">
          {[
            { id: "details", label: "Job Details" },
            { id: "about", label: "About Company" },
            { id: "similar", label: "Similar Jobs" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`h-[44px] px-5 rounded-[10px] text-[14px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#E3EEFF] text-[#1E5BE0] font-semibold border-b-[3px] border-[#1E5BE0]"
                    : "text-[#0B1F4B] hover:bg-[#F7F9FD] hover:text-[#1E5BE0]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 4. Center Content + Right Panel Layout */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= CENTER CONTENT ================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* Main Job Content Card */}
            <div
              id="details"
              className="bg-white rounded-[14px] border border-[#EEF1F7] p-6 lg:p-7 shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-[0_8px_20px_rgba(11,31,75,0.08)] transition-all space-y-7"
            >
              {/* Section 1: Job Description */}
              <div>
                <div className="flex items-center gap-2.5 mb-3 text-[#1E5BE0]">
                  <FileText className="w-5 h-5 text-[#1E5BE0]" strokeWidth={2} />
                  <h2 className="text-[18px] font-bold text-[#0B1F4B]">
                    Job Description
                  </h2>
                </div>
                <p className="text-[14px] text-[#475467] leading-[1.7] whitespace-pre-line">
                  {job.description || "No job description provided."}
                </p>
              </div>

              {/* Section 2: Key Responsibilities (Rendered only if real data exists) */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div>
                  <div className="flex items-center gap-2.5 mb-3 text-[#1E5BE0]">
                    <ShieldCheck className="w-5 h-5 text-[#1E5BE0]" strokeWidth={2} />
                    <h2 className="text-[18px] font-bold text-[#0B1F4B]">
                      Key Responsibilities
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {job.responsibilities.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-[#1E5BE0] text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                        <span className="text-[14px] text-[#475467] leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Section 3: Requirements & Eligibility (Rendered only if real data exists) */}
              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <div className="flex items-center gap-2.5 mb-3 text-[#FF6B00]">
                    <FileText className="w-5 h-5 text-[#FF6B00]" strokeWidth={2} />
                    <h2 className="text-[18px] font-bold text-[#0B1F4B]">
                      Requirements & Eligibility
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                        <span className="text-[14px] text-[#475467] leading-relaxed">
                          {req}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Section 4: Skills Required (Rendered only if real skills exist) */}
              {job.skills && job.skills.length > 0 && (
                <div>
                  <div className="flex items-center gap-2.5 mb-3 text-[#1E5BE0]">
                    <Code2 className="w-5 h-5 text-[#1E5BE0]" strokeWidth={2} />
                    <h2 className="text-[18px] font-bold text-[#0B1F4B]">
                      Skills Required
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {job.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-[#E8F0FF] text-[#1E5BE0] rounded-full text-[13px] font-medium px-4 py-1.5 hover:bg-[#1E5BE0] hover:text-white transition-colors cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 5: Benefits & Perks (Rendered only if real benefits exist) */}
              {job.benefits && job.benefits.length > 0 && (
                <div>
                  <div className="flex items-center gap-2.5 mb-3 text-[#1E5BE0]">
                    <Gift className="w-5 h-5 text-[#1E5BE0]" strokeWidth={2} />
                    <h2 className="text-[18px] font-bold text-[#0B1F4B]">
                      Benefits & Perks
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {job.benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="bg-[#F5F7FB] rounded-[10px] p-3.5 flex items-start gap-3 border border-[#EEF1F7]/60 hover:bg-[#EDF2FA] transition-colors"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#22B573] text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                        <span className="text-[13px] text-[#0B1F4B] font-medium leading-snug">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <div className="lg:col-span-4 space-y-5">
            {/* Card 1: About the Company */}
            <div
              id="about"
              className="bg-white rounded-[14px] border border-[#EEF1F7] p-5 shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-[0_8px_20px_rgba(11,31,75,0.08)] transition-all"
            >
              <h3 className="text-[18px] font-bold text-[#0B1F4B] mb-4">
                About the Company
              </h3>

              {/* Company Logo Tile + Name */}
              <div className="flex items-center gap-3.5 mb-3.5">
                <div className="w-16 h-16 rounded-xl border border-[#EEF1F7] bg-white p-2 flex items-center justify-center shrink-0 shadow-sm">
                  {(job.company.logo || job.company.id) ? (
                    <img
                      src={getCompanyLogoUrl(job.company, job.company.id)}
                      alt={job.company.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        const proxyUrl = job.company.id ? getCompanyLogoProxyUrl(job.company.id) : "";
                        if (proxyUrl && !target.dataset.tried && target.src !== proxyUrl) {
                          target.dataset.tried = "true";
                          target.src = proxyUrl;
                          return;
                        }
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-[#1E5BE0]" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-[15px] font-bold text-[#0B1F4B] truncate">
                      {job.company.name}
                    </h4>
                    <span className="w-4 h-4 rounded-full bg-[#E5F8EE] text-[#22B573] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  </div>
                  <p className="text-[12px] text-[#6B7694] leading-snug line-clamp-2 mt-0.5">
                    {job.company.industry || "Registered Partner"}
                  </p>
                </div>
              </div>

              {/* Real Company About Text */}
              <p className="text-[13px] text-[#6B7694] leading-relaxed mb-4">
                {job.company.about || job.company.description || "Hiring partner on WeGrow Skill Campus."}
              </p>

              {/* Info Rows */}
              <div className="space-y-2.5 text-[13px] border-t border-[#EEF1F7] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7694]">Industry:</span>
                  <span className="font-bold text-[#0B1F4B]">{job.company.industry || "Not Disclosed"}</span>
                </div>
                {job.company.size && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7694]">Company Size:</span>
                    <span className="font-bold text-[#0B1F4B]">{job.company.size}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7694]">Location:</span>
                  <span className="font-bold text-[#0B1F4B]">{job.company.location || job.location}</span>
                </div>
                {job.company.website && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7694]">Website:</span>
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#1E5BE0] hover:underline flex items-center gap-1 truncate max-w-[180px]"
                    >
                      <span className="truncate">{job.company.website.replace(/^https?:\/\//, "")}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>

              {job.company.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 w-full h-[44px] rounded-[10px] border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] font-semibold text-[13px] hover:bg-[#E3EEFF] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Visit Company Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Card 2: Application Details */}
            <div className="bg-white rounded-[14px] border border-[#EEF1F7] p-5 shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-[0_8px_20px_rgba(11,31,75,0.08)] transition-all">
              <div className="flex items-center gap-2 mb-4 text-[#1E5BE0]">
                <Briefcase className="w-5 h-5 text-[#1E5BE0]" />
                <h3 className="text-[18px] font-bold text-[#0B1F4B]">
                  Application Details
                </h3>
              </div>

              {/* Real Rows */}
              <div className="space-y-3 text-[13px] mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7694] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#6B7694]" />
                    Application Deadline:
                  </span>
                  <span className="font-bold text-[#0B1F4B]">
                    {job.deadline
                      ? new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : "Open / Immediate"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#6B7694] flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#6B7694]" />
                    Posted On:
                  </span>
                  <span className="font-bold text-[#0B1F4B]">
                    {job.postedDate
                      ? new Date(job.postedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : "Recently"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#6B7694] flex items-center gap-2">
                    <Users2 className="w-4 h-4 text-[#6B7694]" />
                    Total Openings:
                  </span>
                  <span className="font-bold text-[#0B1F4B]">
                    {`${job.openings || 1} Position${(job.openings || 1) > 1 ? "s" : ""}`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#6B7694] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#6B7694]" />
                    Job ID:
                  </span>
                  <span className="font-bold text-[#0B1F4B] font-mono">
                    {job.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Verified Placement Drive Notice */}
              <div className="bg-[#FFF3E6] border border-[#FFE0C2] rounded-[12px] p-3.5 mb-4">
                <div className="flex items-center gap-2 text-[#FF6B00] mb-1">
                  <AlertCircle className="w-4 h-4 text-[#FF6B00] shrink-0" />
                  <h5 className="text-[14px] font-semibold text-[#FF6B00]">
                    Verified Campus Opportunity
                  </h5>
                </div>
                <p className="text-[12px] text-[#6B7694] leading-relaxed">
                  Your registered student profile and credentials will be submitted directly to {job.company.name}.
                </p>
              </div>

              {isApplied ? (
                <button
                  type="button"
                  disabled
                  className="w-full h-[44px] rounded-[10px] text-[14px] font-semibold flex items-center justify-center gap-2 bg-[#22B573] text-white cursor-not-allowed shadow-none"
                >
                  Already Applied ✓
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(true)}
                  className="w-full h-[44px] rounded-[10px] text-[14px] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(255,107,0,0.25)] hover:shadow-[0_6px_20px_rgba(255,107,0,0.35)] bg-[#FF6B00] text-white hover:bg-[#E86100]"
                >
                  Apply Now
                </button>
              )}
            </div>

            {/* Card 3: Similar Jobs */}
            <div
              id="similar"
              className="bg-white rounded-[14px] border border-[#EEF1F7] p-5 shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-[0_8px_20px_rgba(11,31,75,0.08)] transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] font-bold text-[#0B1F4B]">
                  Similar Jobs
                </h3>
                <Link
                  href="/student/jobs"
                  className="text-[13px] font-semibold text-[#1E5BE0] hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="divide-y divide-[#EEF1F7]">
                {displaySimilar.length === 0 ? (
                  <p className="py-6 text-center text-xs text-[#6B7694]">
                    No other similar jobs posted at this time.
                  </p>
                ) : (
                  displaySimilar.slice(0, 3).map((item) => (
                    <Link
                      key={item.id}
                      href={`/student/jobs/${item.id}`}
                      className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group block"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg border border-[#EEF1F7] bg-white p-1 flex items-center justify-center shrink-0 font-bold text-xs text-[#1E5BE0]">
                          {(item.company?.logo || item.company?.id) ? (
                            <img
                              src={getCompanyLogoUrl(item.company, item.company?.id)}
                              alt={item.company.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                const proxyUrl = item.company?.id ? getCompanyLogoProxyUrl(item.company.id) : "";
                                if (proxyUrl && target.src !== proxyUrl) {
                                  target.src = proxyUrl;
                                  return;
                                }
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent && !parent.querySelector(".logo-fb")) {
                                  const fb = document.createElement("span");
                                  fb.textContent = (item.company?.name || "C").slice(0, 2).toUpperCase();
                                  fb.className = "font-bold text-xs text-[#1E5BE0] logo-fb";
                                  parent.appendChild(fb);
                                }
                              }}
                            />
                          ) : (
                            (item.company?.name || 'C').charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[14px] font-bold text-[#0B1F4B] group-hover:text-[#1E5BE0] transition-colors truncate">
                            {item.title}
                          </h4>
                          <p className="text-[12px] text-[#6B7694] truncate">
                            {item.company?.name} • {item.location}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="bg-[#E8F0FF] text-[#1E5BE0] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              {item.experience || "Fresher"}
                            </span>
                            <span className="bg-[#E8F0FF] text-[#1E5BE0] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              {item.workMode || "Hybrid"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#FF6B00] group-hover:translate-x-1 transition-transform shrink-0" />
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Apply Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F4B]/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-[16px] shadow-2xl border border-[#EEF1F7] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#EEF1F7] flex items-center justify-between bg-[#F7F9FD]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FFF3E6] flex items-center justify-center text-[#FF6B00]">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#0B1F4B]">
                  Confirm Job Application
                </h3>
              </div>
              <button
                onClick={() => setApplyModalOpen(false)}
                className="w-8 h-8 rounded-full text-[#6B7694] hover:bg-slate-100 flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F7F9FD] border border-[#EEF1F7]">
                <div className="w-12 h-12 rounded-lg bg-white p-1 border border-[#EEF1F7] flex items-center justify-center shrink-0">
                  {(job.company.logo || job.company.id) ? (
                    <img
                      src={getCompanyLogoUrl(job.company, job.company.id)}
                      alt={job.company.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <Building2 className="w-6 h-6 text-[#1E5BE0]" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-[15px] text-[#0B1F4B]">{job.title}</h4>
                  <p className="text-xs text-[#6B7694]">{job.company.name} • {job.location}</p>
                </div>
              </div>

              <div className="bg-[#E8F0FF] border border-[#BBD3FA] rounded-xl p-3.5 text-xs text-[#1E5BE0] leading-relaxed">
                <p className="font-semibold text-[#1E5BE0] mb-1">
                  Ready to apply from Student Dashboard:
                </p>
                Your verified profile and credentials will be submitted directly to <strong>{job.company.name}</strong>.
              </div>

              {studentProfile && (
                <div className="text-xs text-[#6B7694] space-y-1.5 bg-[#F7F9FD] p-3 rounded-xl border border-[#EEF1F7]">
                  <div className="flex justify-between">
                    <span>Applicant Name:</span>
                    <span className="font-bold text-[#0B1F4B]">{studentProfile.fullName}</span>
                  </div>
                  {studentProfile.degree && (
                    <div className="flex justify-between">
                      <span>Education:</span>
                      <span className="font-bold text-[#0B1F4B]">{studentProfile.degree}</span>
                    </div>
                  )}
                  {studentProfile.email && (
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="font-bold text-[#0B1F4B]">{studentProfile.email}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#F7F9FD] border-t border-[#EEF1F7] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setApplyModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-[#6B7694] hover:text-[#0B1F4B] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApply}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#E86100] text-white text-sm font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <span>Submit Application →</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Bottom Bar for Apply button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#EEF1F7] p-3 px-4 flex items-center justify-between gap-3 shadow-[0_-4px_14px_rgba(11,31,75,0.06)]">
        <div>
          <span className="text-[11px] text-[#6B7694] block">Salary / Stipend</span>
          <span className="text-[13px] font-bold text-[#0B1F4B] block">{formattedSalary}</span>
        </div>
        <button
          onClick={() => setApplyModalOpen(true)}
          disabled={isApplied}
          className={`flex-1 max-w-[240px] h-[42px] rounded-xl text-[13px] font-semibold flex items-center justify-center transition shadow-md ${
            isApplied
              ? "bg-[#22B573] text-white cursor-default"
              : "bg-[#FF6B00] text-white hover:bg-[#E86100]"
          }`}
        >
          {isApplied ? "Applied ✓" : "Apply Now →"}
        </button>
      </div>
    </div>
  );
}
