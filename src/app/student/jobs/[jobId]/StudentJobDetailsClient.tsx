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
  AlertCircle,
  Share2,
  Copy,
  Calendar,
  GraduationCap,
  Award,
  Send,
  Layers,
  HeartHandshake,
  CheckCircle,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationsService } from "@/services/applications.service";
import { studentService } from "@/services/student.service";
import { jobsService } from "@/services/jobs.service";
import { getCompanyLogoUrl, getCompanyLogoProxyUrl, getNameInitials } from "@/lib/utils";

interface StudentJobDetailsClientProps {
  job: Job;
  similarJobs?: Job[];
}

export default function StudentJobDetailsClient({
  job,
  similarJobs = [],
}: StudentJobDetailsClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Destructure hasApplied & applicationId from job
  const { hasApplied, applicationId: initialAppId } = job;

  // State
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(Boolean(hasApplied));
  const [applicationId, setApplicationId] = useState<string | undefined>(initialAppId);
  const [coverNote, setCoverNote] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedJobId, setCopiedJobId] = useState(false);

  const markApplied = (appId?: string) => {
    setIsApplied(true);
    if (appId) setApplicationId(appId);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStickyHeaderVisible, setIsStickyHeaderVisible] = useState(false);
  const [studentProfile, setStudentProfile] = useState<{
    fullName: string;
    degree?: string;
    institution?: string;
    email?: string;
  } | null>(null);

  const { data: cachedProfile } = useQuery({
    queryKey: ["student-profile"],
    queryFn: () => studentService.getProfile(),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (cachedProfile) {
      const edu = (cachedProfile as any).educations?.[0] || cachedProfile.education?.[0];
      setStudentProfile({
        fullName: (cachedProfile as any).fullName || cachedProfile.name || "Student",
        degree: edu?.degree ? `${edu.degree}${edu.institution ? ` - ${edu.institution}` : ""}` : undefined,
        email: cachedProfile.email || undefined,
      });
    }
  }, [cachedProfile]);

  // Check saved and applied status directly from backend APIs & fresh job info (DB is single source of truth)
  useEffect(() => {
    let isMounted = true;

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(`applied_job_${job.id}`);
      } catch {}
    }

    Promise.all([
      studentService.getSavedJobs().catch(() => []),
      applicationsService.getStudentApplications().catch(() => []),
      jobsService.getJobById(job.id).catch(() => null),
    ]).then(([savedList, applicationsList, freshJob]) => {
      if (!isMounted) return;

      const applicationFound = Array.isArray(applicationsList) && applicationsList.find((app) => app.jobId === job.id);
      const isJobAppliedInDb = Boolean(freshJob?.hasApplied || applicationFound);

      setIsApplied(isJobAppliedInDb);
      if (applicationFound) {
        setApplicationId(applicationFound.id);
      } else if (freshJob?.applicationId) {
        setApplicationId(freshJob.applicationId);
      } else {
        setApplicationId(undefined);
      }

      if (Array.isArray(savedList)) {
        setIsSaved(savedList.some((sj) => sj.id === job.id));
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
      setIsStickyHeaderVisible(scrollPos > 320);

      // Scroll Spy for tabs
      const sections = ["overview", "responsibilities", "requirements", "skills-perks", "company", "similar"];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 120) {
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
    }, 3200);
  };

  // Toggle Save/Bookmark via backend API
  const handleToggleSave = async () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    if (nextSaved) {
      const success = await studentService.saveJob(job.id);
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["student-saved-jobs"] });
        triggerToast("Job saved to your bookmarks!");
      } else {
        setIsSaved(false);
        triggerToast("Failed to save job");
      }
    } else {
      const success = await studentService.removeSavedJob(job.id);
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["student-saved-jobs"] });
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

  // Copy job link
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      triggerToast("Job link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Copy Job ID
  const handleCopyJobId = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(job.id);
      setCopiedJobId(true);
      triggerToast("Job reference ID copied!");
      setTimeout(() => setCopiedJobId(false), 2500);
    }
  };

  // Confirm Apply via Backend API
  const handleConfirmApply = async () => {
    setIsSubmitting(true);
    try {
      const res = await applicationsService.applyToJob(job.id, {
        fullName: studentProfile?.fullName || "Candidate",
        coverNote: coverNote.trim() || "Application submitted via WeGrow Student Campus Portal.",
      });

      if (res.success) {
        markApplied(res.data?.id);
        setApplyModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["student-applications"] });
        queryClient.invalidateQueries({ queryKey: ["student-dashboard"] });
        queryClient.invalidateQueries({ queryKey: ["browse-jobs"] });
        triggerToast("Application submitted successfully! Track it in My Applications.");
      } else if (res.message?.toLowerCase().includes("already applied") || res.message?.toLowerCase().includes("already exists")) {
        markApplied();
        setApplyModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["student-applications"] });
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
  const formatSalaryText = () => {
    if (job.salaryMin && job.salaryMax) {
      const minLPA = (job.salaryMin / 100000).toLocaleString("en-IN", { maximumFractionDigits: 1 });
      const maxLPA = (job.salaryMax / 100000).toLocaleString("en-IN", { maximumFractionDigits: 1 });
      return `₹${minLPA} - ₹${maxLPA} LPA`;
    }
    if (job.salaryMin) {
      const minLPA = (job.salaryMin / 100000).toLocaleString("en-IN", { maximumFractionDigits: 1 });
      return `₹${minLPA} LPA+`;
    }
    return "Competitive Package";
  };

  const formattedSalary = formatSalaryText();
  const displaySimilar = similarJobs;

  return (
    <div className="relative pb-28 lg:pb-20 font-['Poppins',sans-serif] text-[#0B1F4B] bg-[#F7F9FD] min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0B1F4B] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold animate-in fade-in slide-in-from-top-4 duration-200 border border-white/10">
          <CheckCircle2 className="w-5 h-5 text-[#22B573] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Compact Job Header on Scroll */}
      <div
        className={`fixed top-[60px] sm:top-[66px] left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EEF1F7] px-4 lg:px-8 py-3 transition-all duration-300 shadow-sm ${
          isStickyHeaderVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl border border-[#EEF1F7] bg-white p-1 flex items-center justify-center shrink-0 shadow-2xs">
              {job.company.logo || job.company.id ? (
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
                {job.company.name} • {job.location} • <span className="font-semibold text-[#1E5BE0]">{formattedSalary}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleToggleSave}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                isSaved
                  ? "bg-[#1E5BE0] border-[#1E5BE0] text-white shadow-2xs"
                  : "bg-white border-[#EEF1F7] text-[#6B7694] hover:text-[#1E5BE0] hover:bg-[#F7F9FD]"
              }`}
              aria-label="Bookmark Job"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
            </button>

            {isApplied ? (
              <button
                disabled
                className="text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl bg-[#E8F8EF] text-[#22B573] border border-[#C6F0D8] cursor-not-allowed shadow-none flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Already Applied</span>
              </button>
            ) : (
              <button
                onClick={() => setApplyModalOpen(true)}
                className="text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-[0_4px_14px_rgba(255,107,0,0.25)] hover:shadow-[0_6px_20px_rgba(255,107,0,0.35)] bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white active:scale-95 cursor-pointer"
              >
                Apply Now →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {/* Breadcrumb Navigation & Back Link */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <Link
            href="/student/jobs"
            className="inline-flex items-center gap-2 text-[13px] sm:text-[14px] font-semibold text-[#6B7694] hover:text-[#1E5BE0] transition-colors group bg-white px-3.5 py-1.5 rounded-xl border border-[#EEF1F7] shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#1E5BE0]" />
            <span>Back to All Jobs</span>
          </Link>

          {/* Quick Breadcrumbs */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#8E9AAC]">
            <span>Jobs</span>
            <span>/</span>
            <span className="text-[#1E5BE0] font-medium">{job.jobType}</span>
            <span>/</span>
            <span className="text-[#0B1F4B] font-semibold max-w-[200px] truncate">{job.title}</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 1. HERO JOB HEADER BANNER                                      */}
        {/* ============================================================== */}
        <div className="relative overflow-hidden rounded-[22px] bg-white border border-[#EEF1F7] shadow-[0_4px_24px_rgba(11,31,75,0.06)] p-5 sm:p-7 lg:p-8 transition-all space-y-5">
          {/* Subtle decorative background gradient splash */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FFF0E6]/60 via-[#E8F0FF]/40 to-transparent rounded-full blur-3xl -z-0 pointer-events-none" />

          {/* Top Row: Logo + (Job Title, Company Name, City only) */}
          <div className="relative z-10 flex items-start gap-4 sm:gap-5 min-w-0">
            {/* Company Logo Tile */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-[#EEF1F7] bg-white p-2 flex items-center justify-center shrink-0 shadow-sm ring-1 ring-slate-100">
              {job.company.logo || job.company.id ? (
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
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-[#1E5BE0] to-sky-400 text-white font-black text-xl flex items-center justify-center">
                  {getNameInitials(job.company.name)}
                </div>
              )}
              {/* Verified badge pin */}
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#22B573] text-white flex items-center justify-center border-2 border-white shadow-xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>

            {/* Beside the logo: ONLY Job Name, Company Name, and City! */}
            <div className="min-w-0 flex-1 space-y-1">
              {/* 1. Job Name */}
              <h1 className="text-xl sm:text-2xl lg:text-[28px] font-extrabold text-[#0B1F4B] leading-tight tracking-tight">
                {job.title}
              </h1>

              {/* 2. Company Name */}
              <div className="flex items-center gap-1.5 text-sm sm:text-[15px] font-bold text-[#1E5BE0]">
                <a href="#company" className="hover:underline flex items-center gap-1.5">
                  <span>{job.company.name}</span>
                  <CheckCircle2 className="w-4 h-4 text-[#22B573] shrink-0" />
                </a>
              </div>

              {/* 3. City / Location */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-[#6B7694]">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                <span className="font-medium text-[#475467]">{job.location}</span>
                {job.workMode && (
                  <span className="text-[#8E9AAC]">({job.workMode})</span>
                )}
                {job.postedDate && (
                  <>
                    <span>·</span>
                    <span className="text-[#8E9AAC]">
                      {new Date(job.postedDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Everything else is below the logo across full width */}
          <div className="relative z-10 pt-1 space-y-4">
            {/* Attribute Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#E8F8EF] text-[#22B573] border border-[#C6F0D8]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22B573]" />
                Verified Campus Partner
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#E8F0FF] text-[#1E5BE0] border border-[#D0E2FF]">
                <Sparkles className="w-3.5 h-3.5 text-[#1E5BE0]" />
                {job.experience || "Fresher Friendly"}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFF0E6] text-[#FF6B00] border border-[#FFE0CC]">
                <Tag className="w-3.5 h-3.5 text-[#FF6B00]" />
                {job.jobType}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#F8FAFD] text-[#0B1F4B] border border-[#EEF1F7]">
                <IndianRupee className="w-3 h-3 text-[#FF6B00]" />
                {formattedSalary}
              </span>

              {job.status === "Published" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Actively Hiring
                </span>
              )}
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {isApplied ? (
                <button
                  disabled
                  className="h-11 px-6 rounded-xl text-xs sm:text-sm font-bold bg-[#E8F8EF] text-[#22B573] border border-[#C6F0D8] cursor-not-allowed shadow-none flex items-center justify-center gap-2 select-none"
                >
                  <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                  <span>Already Applied</span>
                </button>
              ) : (
                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="h-11 px-7 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(255,107,0,0.3)] hover:shadow-[0_8px_25px_rgba(255,107,0,0.4)] bg-gradient-to-r from-[#FF6B00] via-[#FF7A1A] to-[#FF8533] text-white hover:opacity-95 active:scale-98"
                >
                  <span>Apply Now</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={handleToggleSave}
                className={`h-11 px-5 rounded-xl border flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSaved
                    ? "bg-[#1E5BE0] border-[#1E5BE0] text-white shadow-sm"
                    : "bg-white border-[#EEF1F7] text-[#475467] hover:border-[#1E5BE0] hover:text-[#1E5BE0] hover:bg-[#F7F9FD]"
                }`}
                aria-label="Bookmark Job"
                title={isSaved ? "Saved in Bookmarks" : "Save this Job"}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? "fill-white text-white" : ""}`} />
                <span>{isSaved ? "Saved" : "Save"}</span>
              </button>

              <button
                onClick={handleShare}
                className="h-11 px-5 rounded-xl border border-[#EEF1F7] bg-white hover:bg-[#F7F9FD] text-[#475467] hover:text-[#0B1F4B] flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                title="Share Job"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedLink ? "Copied!" : "Share"}</span>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. FIVE-PILLAR QUICK METRIC CARDS ROW                          */}
          {/* ============================================================== */}
          <div className="mt-7 pt-6 border-t border-[#EEF1F7] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {/* 1. Location */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-[#EEF1F7] hover:border-[#D0E2FF] transition-all flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold text-[#8E9AAC] uppercase tracking-wider">
                  Location
                </span>
                <span className="block text-[13px] sm:text-[14px] font-bold text-[#0B1F4B] truncate">
                  {job.location}
                </span>
              </div>
            </div>

            {/* 2. Salary / Package */}
            <div className="p-3.5 rounded-xl bg-[#FFF8F3] border border-[#FFE8D6] hover:border-[#FFD2A8] transition-all flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0E6] text-[#FF6B00] flex items-center justify-center shrink-0">
                <IndianRupee className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold text-[#FF8533] uppercase tracking-wider">
                  Compensation
                </span>
                <span className="block text-[13px] sm:text-[14px] font-bold text-[#FF6B00] truncate">
                  {formattedSalary}
                </span>
              </div>
            </div>

            {/* 3. Experience */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-[#EEF1F7] hover:border-[#D0E2FF] transition-all flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold text-[#8E9AAC] uppercase tracking-wider">
                  Experience
                </span>
                <span className="block text-[13px] sm:text-[14px] font-bold text-[#0B1F4B] truncate">
                  {job.experience || "Fresher"}
                </span>
              </div>
            </div>

            {/* 4. Employment Type */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-[#EEF1F7] hover:border-[#D0E2FF] transition-all flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                <Monitor className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold text-[#8E9AAC] uppercase tracking-wider">
                  Work Mode
                </span>
                <span className="block text-[13px] sm:text-[14px] font-bold text-[#0B1F4B] truncate">
                  {job.workMode}
                </span>
              </div>
            </div>

            {/* 5. Openings & Positions */}
            <div className="p-3.5 rounded-xl bg-[#E8F8EF]/60 border border-[#C6F0D8] hover:border-[#A3E5C2] transition-all flex items-center gap-3 col-span-2 sm:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-[#E8F8EF] text-[#22B573] flex items-center justify-center shrink-0">
                <Users2 className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold text-[#22B573] uppercase tracking-wider">
                  Openings
                </span>
                <span className="block text-[13px] sm:text-[14px] font-bold text-[#0B1F4B] truncate">
                  {job.openings || 1} Position{(job.openings || 1) > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. SEGMENTED NAVIGATION TABS (Interactive Smooth Scroll)        */}
        {/* ============================================================== */}
        <div className="mt-6 bg-white rounded-2xl border border-[#EEF1F7] p-1.5 flex items-center gap-1.5 overflow-x-auto shadow-2xs no-scrollbar sticky top-[115px] z-20 backdrop-blur-md">
          {[
            { id: "overview", label: "Overview & Details" },
            { id: "responsibilities", label: "Responsibilities" },
            { id: "requirements", label: "Requirements" },
            { id: "skills-perks", label: "Skills & Perks" },
            { id: "company", label: "About Company" },
            { id: "similar", label: `Similar Jobs (${displaySimilar.length})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`h-10 px-4 sm:px-5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#1E5BE0] text-white shadow-2xs font-bold"
                    : "text-[#6B7694] hover:bg-[#F7F9FD] hover:text-[#0B1F4B]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* 4. MAIN TWO-COLUMN CONTENT GRID                                */}
        {/* ============================================================== */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= CENTER COLUMN (8 cols) ================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section 1: Overview & Job Description */}
            <div
              id="overview"
              className="bg-white rounded-2xl border border-[#EEF1F7] p-6 lg:p-7 shadow-[0_4px_16px_rgba(11,31,75,0.04)] space-y-5"
            >
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#EEF1F7]">
                <div className="w-9 h-9 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center">
                  <FileText className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0B1F4B]">About the Role</h2>
                  <p className="text-xs text-[#8E9AAC]">Detailed job summary and key focus areas</p>
                </div>
              </div>

              <div className="text-[14.5px] text-[#475467] leading-[1.8] whitespace-pre-line space-y-3">
                {job.description || "No job description provided for this opening."}
              </div>
            </div>

            {/* Section 2: Key Responsibilities */}
            <div
              id="responsibilities"
              className="bg-white rounded-2xl border border-[#EEF1F7] p-6 lg:p-7 shadow-[0_4px_16px_rgba(11,31,75,0.04)] space-y-5"
            >
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#EEF1F7]">
                <div className="w-9 h-9 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0B1F4B]">Key Responsibilities</h2>
                  <p className="text-xs text-[#8E9AAC]">What you will be doing day-to-day</p>
                </div>
              </div>

              {job.responsibilities && job.responsibilities.length > 0 ? (
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, idx) => (
                    <li
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#F8FAFD] border border-[#EEF1F7] flex items-start gap-3 hover:bg-[#F2F6FC] transition-colors"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#1E5BE0] text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="text-[14px] text-[#334155] leading-relaxed">
                        {resp}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#8E9AAC] italic">
                  Responsibilities will be discussed during initial interview screening.
                </p>
              )}
            </div>

            {/* Section 3: Requirements & Eligibility */}
            <div
              id="requirements"
              className="bg-white rounded-2xl border border-[#EEF1F7] p-6 lg:p-7 shadow-[0_4px_16px_rgba(11,31,75,0.04)] space-y-5"
            >
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#EEF1F7]">
                <div className="w-9 h-9 rounded-xl bg-[#FFF0E6] text-[#FF6B00] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0B1F4B]">Requirements & Eligibility</h2>
                  <p className="text-xs text-[#8E9AAC]">Candidate criteria and qualifications</p>
                </div>
              </div>

              {job.requirements && job.requirements.length > 0 ? (
                <ul className="space-y-3">
                  {job.requirements.map((req, idx) => (
                    <li
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#FFF9F5] border border-[#FFEADB] flex items-start gap-3 hover:bg-[#FFF3E8] transition-colors"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                      <span className="text-[14px] text-[#334155] leading-relaxed">
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#8E9AAC] italic">
                  Open to all energetic candidates meeting degree baseline.
                </p>
              )}
            </div>

            {/* Section 4: Skills & Benefits */}
            <div
              id="skills-perks"
              className="bg-white rounded-2xl border border-[#EEF1F7] p-6 lg:p-7 shadow-[0_4px_16px_rgba(11,31,75,0.04)] space-y-6"
            >
              {/* Skills required */}
              <div>
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center">
                    <Code2 className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-bold text-[#0B1F4B]">Skills & Tech Stack</h3>
                </div>

                {job.skills && job.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F0F5FF] text-[#1E5BE0] border border-[#D0E2FF] text-xs sm:text-[13px] font-semibold hover:bg-[#1E5BE0] hover:text-white transition-all cursor-default select-none shadow-2xs"
                      >
                        <Sparkles className="w-3 h-3" />
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#8E9AAC]">No specific skill tags provided.</p>
                )}
              </div>

              {/* Benefits & Perks */}
              {job.benefits && job.benefits.length > 0 && (
                <div className="pt-5 border-t border-[#EEF1F7]">
                  <div className="flex items-center gap-2.5 mb-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#E8F8EF] text-[#22B573] flex items-center justify-center">
                      <Gift className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <h3 className="text-base font-bold text-[#0B1F4B]">Benefits & Perks</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {job.benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#F8FAFD] border border-[#EEF1F7] flex items-center gap-3 hover:border-[#C6F0D8] hover:bg-[#F2FBF6] transition-all"
                      >
                        <span className="w-6 h-6 rounded-full bg-[#E8F8EF] text-[#22B573] flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-[#0B1F4B]">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Campus Hiring Process Timeline */}
            <div className="bg-white rounded-2xl border border-[#EEF1F7] p-6 lg:p-7 shadow-[0_4px_16px_rgba(11,31,75,0.04)] space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#EEF1F7]">
                <div className="w-9 h-9 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center">
                  <Layers className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0B1F4B]">Recruitment Workflow</h2>
                  <p className="text-xs text-[#8E9AAC]">Typical 4-stage evaluation flow for this role</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                {[
                  { step: "01", title: "Apply Online", desc: "Profile & credentials submitted" },
                  { step: "02", title: "Shortlisting", desc: "Recruiter screening & assessment" },
                  { step: "03", title: "Interviews", desc: "Technical & problem solving round" },
                  { step: "04", title: "Final Offer", desc: "HR discussion & onboarding" },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#F8FAFD] border border-[#EEF1F7] hover:border-[#1E5BE0] hover:bg-[#F0F5FF] transition-all relative group"
                  >
                    <span className="text-xs font-black text-[#1E5BE0] block mb-1">
                      STEP {s.step}
                    </span>
                    <h4 className="text-sm font-bold text-[#0B1F4B] mb-1">
                      {s.title}
                    </h4>
                    <p className="text-[11px] text-[#6B7694] leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDEBAR COLUMN (4 cols) ================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: About Company Profile Card */}
            <div
              id="company"
              className="bg-white rounded-2xl border border-[#EEF1F7] p-6 shadow-[0_4px_16px_rgba(11,31,75,0.04)] space-y-4"
            >
              <div className="flex items-center gap-3.5 pb-4 border-b border-[#EEF1F7]">
                <div className="w-14 h-14 rounded-xl border border-[#EEF1F7] bg-white p-2 flex items-center justify-center shrink-0 shadow-2xs">
                  {job.company.logo || job.company.id ? (
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
                    <Building2 className="w-7 h-7 text-[#1E5BE0]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-[#0B1F4B] truncate">
                      {job.company.name}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-[#22B573] shrink-0" />
                  </div>
                  <p className="text-xs text-[#8E9AAC] truncate mt-0.5">
                    {job.company.industry || "Registered Partner"}
                  </p>
                </div>
              </div>

              {/* Company Summary */}
              <p className="text-xs text-[#6B7694] leading-relaxed line-clamp-4">
                {job.company.about || job.company.description || "Official corporate partner hiring qualified student graduates on WeGrow Skill Campus."}
              </p>

              {/* Quick Details Table */}
              <div className="space-y-2.5 text-xs border-t border-[#EEF1F7] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#8E9AAC]">Industry:</span>
                  <span className="font-semibold text-[#0B1F4B]">{job.company.industry || "Information Technology"}</span>
                </div>
                {job.company.size && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#8E9AAC]">Company Size:</span>
                    <span className="font-semibold text-[#0B1F4B]">{job.company.size}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[#8E9AAC]">Headquarters:</span>
                  <span className="font-semibold text-[#0B1F4B]">{job.company.location || job.location}</span>
                </div>
              </div>

              {job.company.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-10 rounded-xl border border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#E8F0FF] transition-all flex items-center justify-center gap-2 text-xs font-bold cursor-pointer mt-2"
                >
                  <span>Visit Company Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Card 2: Application Details Summary */}
            <div className="bg-white rounded-2xl border border-[#EEF1F7] p-6 shadow-[0_4px_16px_rgba(11,31,75,0.04)] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#EEF1F7]">
                <Clock className="w-4 h-4 text-[#1E5BE0]" />
                <h3 className="text-sm font-bold text-[#0B1F4B]">Application Details</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#8E9AAC]">Deadline:</span>
                  <span className="font-bold text-[#0B1F4B]">
                    {job.deadline
                      ? new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : "Immediate / Rolling"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#8E9AAC]">Posted Date:</span>
                  <span className="font-semibold text-[#0B1F4B]">
                    {job.postedDate
                      ? new Date(job.postedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : "Recently Posted"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#8E9AAC]">Total Openings:</span>
                  <span className="font-bold text-[#0B1F4B]">
                    {job.openings || 1} Position{(job.openings || 1) > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[#8E9AAC]">Job Reference:</span>
                  <button
                    onClick={handleCopyJobId}
                    className="font-mono font-bold text-[11px] text-[#1E5BE0] hover:underline flex items-center gap-1 cursor-pointer"
                    title="Click to copy Job ID"
                  >
                    <span>{job.id.slice(0, 8).toUpperCase()}</span>
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Student Verified Fast Lane */}
              <div className="p-3.5 rounded-xl bg-[#FFF9F5] border border-[#FFEADB] text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#FF6B00] font-bold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Campus Direct Drive</span>
                </div>
                <p className="text-[11px] text-[#6B7694] leading-relaxed">
                  Your registered verified profile will be immediately delivered to {job.company.name}&apos;s recruiting panel.
                </p>
              </div>

              {/* Apply / Status Button */}
              {isApplied ? (
                <button
                  disabled
                  className="w-full h-11 rounded-xl bg-[#E8F8EF] text-[#22B573] border border-[#C6F0D8] font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed shadow-none"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Application Submitted</span>
                </button>
              ) : (
                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white font-bold text-xs transition-all shadow-md hover:shadow-orange-500/20 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Apply for this Position</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Card 3: Similar Opportunities */}
            <div
              id="similar"
              className="bg-white rounded-2xl border border-[#EEF1F7] p-6 shadow-[0_4px_16px_rgba(11,31,75,0.04)] space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EEF1F7]">
                <h3 className="text-sm font-bold text-[#0B1F4B]">Similar Jobs</h3>
                <Link href="/student/jobs" className="text-xs font-bold text-[#1E5BE0] hover:underline">
                  View All
                </Link>
              </div>

              <div className="divide-y divide-[#EEF1F7]">
                {displaySimilar.length === 0 ? (
                  <p className="py-4 text-center text-xs text-[#8E9AAC]">
                    No other similar jobs found at this time.
                  </p>
                ) : (
                  displaySimilar.slice(0, 3).map((item) => (
                    <Link
                      key={item.id}
                      href={`/student/jobs/${item.id}`}
                      className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl border border-[#EEF1F7] bg-white p-1 flex items-center justify-center shrink-0 font-bold text-xs text-[#1E5BE0] shadow-2xs">
                          {item.company?.logo || item.company?.id ? (
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
                              }}
                            />
                          ) : (
                            getNameInitials(item.company?.name || "C")
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#0B1F4B] group-hover:text-[#1E5BE0] transition-colors truncate">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-[#8E9AAC] truncate mt-0.5">
                            {item.company?.name} • {item.location}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8E9AAC] group-hover:text-[#FF6B00] group-hover:translate-x-1 transition-all shrink-0" />
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. CONFIRMATION APPLY MODAL                                    */}
      {/* ============================================================== */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F4B]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#EEF1F7] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#EEF1F7] flex items-center justify-between bg-gradient-to-r from-[#F8FAFD] to-[#FFF8F3]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFF0E6] text-[#FF6B00] flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1F4B]">
                    Confirm Application
                  </h3>
                  <p className="text-[11px] text-[#8E9AAC]">Direct campus submission to recruiter</p>
                </div>
              </div>
              <button
                onClick={() => setApplyModalOpen(false)}
                className="w-8 h-8 rounded-xl text-[#8E9AAC] hover:text-[#0B1F4B] hover:bg-slate-100 flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Job Preview Tile */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#F8FAFD] border border-[#EEF1F7]">
                <div className="w-12 h-12 rounded-xl bg-white p-1.5 border border-[#EEF1F7] flex items-center justify-center shrink-0 shadow-2xs">
                  {job.company.logo || job.company.id ? (
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
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-[#0B1F4B] truncate">{job.title}</h4>
                  <p className="text-xs text-[#6B7694] truncate">{job.company.name} • {job.location}</p>
                  <span className="text-[11px] font-bold text-[#1E5BE0]">{formattedSalary}</span>
                </div>
              </div>

              {/* Verified Student Profile Card */}
              {studentProfile && (
                <div className="p-4 rounded-xl bg-[#F8FAFD] border border-[#EEF1F7] space-y-2 text-xs">
                  <span className="font-bold text-[#0B1F4B] block text-[11px] uppercase tracking-wider text-[#1E5BE0]">
                    Applicant Profile Information
                  </span>
                  <div className="flex justify-between py-1 border-b border-[#EEF1F7]">
                    <span className="text-[#8E9AAC]">Full Name:</span>
                    <span className="font-bold text-[#0B1F4B]">{studentProfile.fullName}</span>
                  </div>
                  {studentProfile.degree && (
                    <div className="flex justify-between py-1 border-b border-[#EEF1F7]">
                      <span className="text-[#8E9AAC]">Education / Degree:</span>
                      <span className="font-bold text-[#0B1F4B] truncate max-w-[220px]">{studentProfile.degree}</span>
                    </div>
                  )}
                  {studentProfile.email && (
                    <div className="flex justify-between py-1">
                      <span className="text-[#8E9AAC]">Email Address:</span>
                      <span className="font-bold text-[#0B1F4B]">{studentProfile.email}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Optional Cover Note input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1F4B] flex items-center justify-between">
                  <span>Cover Note for Recruiter (Optional)</span>
                  <span className="text-[10px] text-[#8E9AAC] font-normal">Max 250 chars</span>
                </label>
                <textarea
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value.slice(0, 250))}
                  placeholder="Tell the hiring manager why you are interested in this position..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-[#EEF1F7] bg-[#FDFEFE] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 focus:border-[#1E5BE0] transition"
                />
              </div>

              {/* Fast-track assurance badge */}
              <div className="p-3 rounded-xl bg-[#E8F8EF] border border-[#C6F0D8] text-[11px] text-[#1E9E63] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#22B573]" />
                <span>Your application is guaranteed direct delivery to {job.company.name}&apos;s HR panel.</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#F8FAFD] border-t border-[#EEF1F7] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setApplyModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-[#6B7694] hover:text-[#0B1F4B] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApply}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8533] hover:opacity-95 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting Application...</span>
                ) : (
                  <>
                    <span>Confirm & Submit</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. MOBILE STICKY BOTTOM BAR                                    */}
      {/* ============================================================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EEF1F7] p-3 px-4 flex items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(11,31,75,0.08)]">
        <div>
          <span className="text-[10px] text-[#8E9AAC] block uppercase tracking-wider font-semibold">Compensation</span>
          <span className="text-[13px] font-bold text-[#FF6B00] block">{formattedSalary}</span>
        </div>
        {isApplied ? (
          <button
            disabled
            className="flex-1 max-w-[220px] h-11 rounded-xl text-xs font-bold bg-[#E8F8EF] text-[#22B573] border border-[#C6F0D8] flex items-center justify-center gap-1.5 cursor-not-allowed shadow-none"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Already Applied</span>
          </button>
        ) : (
          <button
            onClick={() => setApplyModalOpen(true)}
            className="flex-1 max-w-[220px] h-11 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
          >
            <span>Apply Now</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
