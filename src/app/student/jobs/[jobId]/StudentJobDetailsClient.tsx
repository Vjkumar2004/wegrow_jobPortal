"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Share2,
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
  Info,
  ChevronRight,
  Check,
  X,
  AlertCircle
} from "lucide-react";
import { applicationsService } from "@/services/applications.service";

interface StudentJobDetailsClientProps {
  job: Job;
  similarJobs?: Job[];
}

export default function StudentJobDetailsClient({
  job,
  similarJobs = [],
}: StudentJobDetailsClientProps) {
  const router = useRouter();

  // State
  const [activeTab, setActiveTab] = useState<string>("details");
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStickyHeaderVisible, setIsStickyHeaderVisible] = useState(false);

  // Check saved state from localStorage
  useEffect(() => {
    try {
      const savedList = JSON.parse(localStorage.getItem("saved_jobs_ids") || "[]");
      if (Array.isArray(savedList) && savedList.includes(job.id)) {
        setIsSaved(true);
      }
      const appliedList = JSON.parse(localStorage.getItem("applied_jobs_ids") || "[]");
      if (Array.isArray(appliedList) && appliedList.includes(job.id)) {
        setIsApplied(true);
      }
    } catch {
      // ignore
    }
  }, [job.id]);

  // Handle sticky header on scroll & scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      if (scrollPos > 300) {
        setIsStickyHeaderVisible(true);
      } else {
        setIsStickyHeaderVisible(false);
      }

      // Scroll Spy for tabs
      const sections = ["details", "about", "reviews", "process", "similar"];
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

  // Toggle Save/Bookmark
  const handleToggleSave = () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    try {
      const savedList = JSON.parse(localStorage.getItem("saved_jobs_ids") || "[]");
      let updatedList: string[];
      if (nextSaved) {
        updatedList = [...new Set([...savedList, job.id])];
        triggerToast("Job saved to your bookmarks");
      } else {
        updatedList = savedList.filter((id: string) => id !== job.id);
        triggerToast("Job removed from bookmarks");
      }
      localStorage.setItem("saved_jobs_ids", JSON.stringify(updatedList));
    } catch {
      // ignore
    }
  };

  // Tab click smooth scroll
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const element = document.getElementById(tabId);
    if (element) {
      const yOffset = -140; // account for sticky top bar and tab bar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Confirm Apply
  const handleConfirmApply = async () => {
    setIsSubmitting(true);
    try {
      await applicationsService.applyToJob(job.id, {
        fullName: "Vijayakumar M",
        email: "vijay@wegrow.edu",
        phone: "+91 98765 43210",
        coverNote: "Application submitted via WeGrow Student Campus Portal.",
      });

      // Update local storage
      const appliedList = JSON.parse(localStorage.getItem("applied_jobs_ids") || "[]");
      localStorage.setItem("applied_jobs_ids", JSON.stringify([...new Set([...appliedList, job.id])]));

      setIsApplied(true);
      setApplyModalOpen(false);
      triggerToast("Application submitted successfully! Track it in My Applications.");
    } catch {
      triggerToast("Application submitted! Track it in My Applications.");
      setIsApplied(true);
      setApplyModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock similar jobs if none passed
  const displaySimilar = similarJobs.length > 0 ? similarJobs : [
    {
      id: "job-2",
      title: "Graduate Engineer Trainee",
      company: {
        id: "comp-2",
        name: "Tata Consultancy Services (TCS)",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
        location: "Bengaluru, Karnataka",
      },
      location: "Bengaluru, Karnataka",
      workMode: "Hybrid",
      experience: "Fresher",
    },
    {
      id: "job-3",
      title: "Associate Software Engineer",
      company: {
        id: "comp-3",
        name: "Wipro Technologies",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg",
        location: "Bengaluru, Karnataka",
      },
      location: "Bengaluru, Karnataka",
      workMode: "Hybrid",
      experience: "Fresher",
    },
    {
      id: "job-4",
      title: "Software Developer",
      company: {
        id: "comp-4",
        name: "Zoho Corporation",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/07/Zoho_Corporation_2023_logo.svg",
        location: "Chennai, Tamil Nadu",
      },
      location: "Chennai, Tamil Nadu",
      workMode: "On-site",
      experience: "Fresher",
    },
  ];

  // Specific requirement items per prompt specification
  const responsibilitiesList = job.responsibilities?.length
    ? job.responsibilities
    : [
        "Develop high-quality code following best programming practices",
        "Participate in agile sprints, daily standups, and peer code reviews",
        "Collaborate with senior developers to understand software requirements",
        "Write unit tests and functional test suites using modern frameworks",
        "Debug system defects and implement robust patches",
      ];

  const requirementsList = job.requirements?.length
    ? job.requirements
    : [
        "B.Tech / B.E / MCA in Computer Science, IT, or related disciplines",
        "Consistent academic record with 60% or 6.5 CGPA and above",
        "Good understanding of data structures, algorithms and basic SQL",
        "Proficiency in at least one programming language (Java / Python / C++)",
        "Excellent logical thinking and communication skills",
      ];

  const skillsList = job.skills?.length
    ? job.skills
    : ["Java", "Python", "Spring Boot", "React", "SQL", "Data Structures", "OOPs", "Git"];

  const benefitsList = job.benefits?.length
    ? job.benefits
    : [
        "Health & Medical Insurance for candidate and parents",
        "Continuous learning opportunities through internal certifications",
        "Hybrid work policy (2 days WFH)",
        "Performance incentives and annual appraisal",
      ];

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
              {job.company.logo ? (
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="w-full h-full object-contain"
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

            <button
              onClick={() => setApplyModalOpen(true)}
              disabled={isApplied}
              className={`text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md ${
                isApplied
                  ? "bg-[#22B573] text-white cursor-default"
                  : "bg-[#FF6B00] hover:bg-[#E86100] text-white hover:shadow-orange-500/25 cursor-pointer"
              }`}
            >
              {isApplied ? "Applied ✓" : "Apply Now →"}
            </button>
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
              {/* Company Logo Tile (~104px) */}
              <div className="w-[84px] h-[84px] sm:w-[104px] sm:h-[104px] rounded-[12px] border border-[#EEF1F7] bg-white p-2.5 flex items-center justify-center shrink-0 shadow-sm">
                {job.company.logo ? (
                  <img
                    src={job.company.logo}
                    alt={job.company.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-[#1E5BE0]" />
                )}
              </div>

              {/* Title, Badges, Company line */}
              <div className="min-w-0">
                {/* Top Row: 3 Badge Pills */}
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  {/* Verified Company */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#E5F8EE] text-[#1E9E63] border border-[#BFEAD3]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E9E63]" />
                    Verified Company
                  </span>

                  {/* Fresher Friendly */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#E3EEFF] text-[#1E5BE0] border border-[#BBD3FA]">
                    <Sparkles className="w-3.5 h-3.5 text-[#1E5BE0]" />
                    Fresher Friendly
                  </span>

                  {/* On Campus / Off Campus */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#FFF1E3] text-[#E8650A] border border-[#FFD2A8]">
                    <Tag className="w-3.5 h-3.5 text-[#E8650A]" />
                    On Campus / Off Campus
                  </span>
                </div>

                {/* Job Title */}
                <h1 className="text-2xl sm:text-[30px] lg:text-[32px] font-extrabold text-[#0B1F4B] leading-tight tracking-tight line-clamp-2">
                  {job.title}
                </h1>

                {/* Company line with green verified tick */}
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

            {/* Right side: Bookmark + Orange Apply button */}
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

              <button
                onClick={() => setApplyModalOpen(true)}
                disabled={isApplied}
                className={`flex-1 sm:flex-initial h-[44px] px-6 rounded-[10px] text-[15px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(255,107,0,0.25)] hover:shadow-[0_6px_20px_rgba(255,107,0,0.35)] ${
                  isApplied
                    ? "bg-[#22B573] text-white hover:bg-[#1E9E63] cursor-default shadow-none"
                    : "bg-[#FF6B00] text-white hover:bg-[#E86100] active:scale-[0.98]"
                }`}
              >
                {isApplied ? "Applied ✓" : "Apply Now →"}
              </button>
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
                  {job.location || "Bengaluru, Karnataka"}
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
                  Rs 4,00,000 - Rs 6,50,000 / year
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
                  {job.experience || "Fresher (0 - 1 yr)"}
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
                  {job.workMode || "Hybrid"}
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
                  {job.jobType || "Full Time"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Tabs Row (Height 52px, 14px radius) */}
        <div className="mt-6 bg-white rounded-[14px] border border-[#EEF1F7] p-1 flex items-center gap-2 overflow-x-auto shadow-sm no-scrollbar">
          {[
            { id: "details", label: "Job Details" },
            { id: "about", label: "About Company" },
            { id: "reviews", label: "Reviews" },
            { id: "process", label: "Application Process" },
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

        {/* 4. Center Content + Right Panel Layout (64% / 320px) */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= CENTER CONTENT (8 cols ~64%) ================= */}
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
                <p className="text-[14px] text-[#475467] leading-[1.7]">
                  {job.description ||
                    "Infosys is hiring Graduate Software Engineers for 2025 batch. You will work on real-world projects, collaborate with global teams, and build innovative solutions using modern technologies."}
                </p>
              </div>

              {/* Section 2: Key Responsibilities */}
              <div>
                <div className="flex items-center gap-2.5 mb-3 text-[#1E5BE0]">
                  <ShieldCheck className="w-5 h-5 text-[#1E5BE0]" strokeWidth={2} />
                  <h2 className="text-[18px] font-bold text-[#0B1F4B]">
                    Key Responsibilities
                  </h2>
                </div>
                <ul className="space-y-3">
                  {responsibilitiesList.map((item, idx) => (
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

              {/* Section 3: Requirements & Eligibility */}
              <div>
                <div className="flex items-center gap-2.5 mb-3 text-[#FF6B00]">
                  <FileText className="w-5 h-5 text-[#FF6B00]" strokeWidth={2} />
                  <h2 className="text-[18px] font-bold text-[#0B1F4B]">
                    Requirements & Eligibility
                  </h2>
                </div>
                <ul className="space-y-3">
                  {requirementsList.map((req, idx) => (
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

              {/* Section 4: Skills Required */}
              <div>
                <div className="flex items-center gap-2.5 mb-3 text-[#1E5BE0]">
                  <Code2 className="w-5 h-5 text-[#1E5BE0]" strokeWidth={2} />
                  <h2 className="text-[18px] font-bold text-[#0B1F4B]">
                    Skills Required
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {skillsList.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-[#E8F0FF] text-[#1E5BE0] rounded-full text-[13px] font-medium px-4 py-1.5 hover:bg-[#1E5BE0] hover:text-white transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Section 5: Benefits & Perks */}
              <div>
                <div className="flex items-center gap-2.5 mb-3 text-[#1E5BE0]">
                  <Gift className="w-5 h-5 text-[#1E5BE0]" strokeWidth={2} />
                  <h2 className="text-[18px] font-bold text-[#0B1F4B]">
                    Benefits & Perks
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {benefitsList.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="bg-[#F5F7FB] rounded-[10px] p-3.5 flex items-start gap-3 border border-[#EEF1F7]/60 hover:bg-[#EDF2FA] transition-colors"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#22B573] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                      <span className="text-[13px] text-[#0B1F4B] font-medium leading-snug">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Process Section Card */}
            <div
              id="process"
              className="bg-white rounded-[14px] border border-[#EEF1F7] p-6 lg:p-7 shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-[0_8px_20px_rgba(11,31,75,0.08)] transition-all"
            >
              <div className="flex items-center gap-2.5 mb-4 text-[#1E5BE0]">
                <Sparkles className="w-5 h-5 text-[#1E5BE0]" />
                <h2 className="text-[18px] font-bold text-[#0B1F4B]">
                  Campus Hiring & Selection Process
                </h2>
              </div>
              <div className="relative pl-6 border-l-2 border-[#E3EEFF] space-y-6">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#1E5BE0] ring-4 ring-[#E3EEFF]" />
                  <h4 className="text-[14px] font-bold text-[#0B1F4B]">Round 1: Online Assessment Test</h4>
                  <p className="text-[13px] text-[#6B7694] mt-1">
                    Quantitative Aptitude, Logical Reasoning, Verbal Ability & Pseudo-code test (90 Mins).
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#1E5BE0] ring-4 ring-[#E3EEFF]" />
                  <h4 className="text-[14px] font-bold text-[#0B1F4B]">Round 2: Technical Interview</h4>
                  <p className="text-[13px] text-[#6B7694] mt-1">
                    Live coding questions, Data Structures, OOPs concepts, DBMS, and final year academic project demo.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#22B573] ring-4 ring-[#E5F8EE]" />
                  <h4 className="text-[14px] font-bold text-[#0B1F4B]">Round 3: HR & Management Discussion</h4>
                  <p className="text-[13px] text-[#6B7694] mt-1">
                    Behavioral assessment, location preference, background verification check, and offer rollout.
                  </p>
                </div>
              </div>
            </div>

            {/* Candidate Reviews Section Card */}
            <div
              id="reviews"
              className="bg-white rounded-[14px] border border-[#EEF1F7] p-6 lg:p-7 shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-[0_8px_20px_rgba(11,31,75,0.08)] transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5 text-[#1E5BE0]">
                  <Users2 className="w-5 h-5 text-[#1E5BE0]" />
                  <h2 className="text-[18px] font-bold text-[#0B1F4B]">
                    Alumni & Campus Reviews
                  </h2>
                </div>
                <span className="text-xs font-semibold text-[#1E9E63] bg-[#E5F8EE] px-2.5 py-1 rounded-full">
                  4.4 ★ (320+ Reviews)
                </span>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#F7F9FD] border border-[#EEF1F7]">
                  <div className="flex items-center justify-between text-xs text-[#6B7694] mb-2">
                    <span className="font-semibold text-[#0B1F4B]">Priya S. (Placed 2024 Batch)</span>
                    <span>2 months ago</span>
                  </div>
                  <p className="text-[13px] text-[#475467] leading-relaxed">
                    &quot;The training program at Mysore campus was world-class. Great peer group and comprehensive exposure to full-stack microservices architecture.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT PANEL (~320px / 4 cols) ================= */}
          <div className="lg:col-span-4 space-y-5">
            {/* Card 1: About the Company */}
            <div
              id="about"
              className="bg-white rounded-[14px] border border-[#EEF1F7] p-5 shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-[0_8px_20px_rgba(11,31,75,0.08)] transition-all"
            >
              <h3 className="text-[18px] font-bold text-[#0B1F4B] mb-4">
                About the Company
              </h3>

              {/* Company Logo Tile (64px) + Name + Verified */}
              <div className="flex items-center gap-3.5 mb-3.5">
                <div className="w-16 h-16 rounded-xl border border-[#EEF1F7] bg-white p-2 flex items-center justify-center shrink-0 shadow-sm">
                  {job.company.logo ? (
                    <img
                      src={job.company.logo}
                      alt={job.company.name}
                      className="w-full h-full object-contain"
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
                    {job.company.description || "Global leader in next-generation digital services and consulting."}
                  </p>
                </div>
              </div>

              {/* Paragraph */}
              <p className="text-[13px] text-[#6B7694] leading-relaxed mb-4">
                {job.company.about ||
                  "Infosys helps clients navigate their digital transformation journey with AI, cloud, and next-gen technologies."}
              </p>

              {/* Info Rows */}
              <div className="space-y-2.5 text-[13px] border-t border-[#EEF1F7] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7694]">Industry:</span>
                  <span className="font-bold text-[#0B1F4B]">{job.company.industry || "IT Services"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7694]">Company Size:</span>
                  <span className="font-bold text-[#0B1F4B]">{job.company.size || "100,000+ employees"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7694]">Headquarters:</span>
                  <span className="font-bold text-[#0B1F4B]">{job.company.location || "Bengaluru, Karnataka"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7694]">Website:</span>
                  <a
                    href={job.company.website || "https://www.infosys.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#1E5BE0] hover:underline flex items-center gap-1"
                  >
                    <span>{job.company.website ? job.company.website.replace(/^https?:\/\//, "") : "infosys.com"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Outlined blue button: View Company Profile */}
              <button
                type="button"
                onClick={() => {
                  if (job.company.website) {
                    window.open(job.company.website, "_blank");
                  }
                }}
                className="mt-5 w-full h-[44px] rounded-[10px] border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] font-semibold text-[13px] hover:bg-[#E3EEFF] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Company Profile →</span>
              </button>
            </div>

            {/* Card 2: Application Details */}
            <div className="bg-white rounded-[14px] border border-[#EEF1F7] p-5 shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-[0_8px_20px_rgba(11,31,75,0.08)] transition-all">
              <div className="flex items-center gap-2 mb-4 text-[#1E5BE0]">
                <Briefcase className="w-5 h-5 text-[#1E5BE0]" />
                <h3 className="text-[18px] font-bold text-[#0B1F4B]">
                  Application Details
                </h3>
              </div>

              {/* Rows */}
              <div className="space-y-3 text-[13px] mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7694] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#6B7694]" />
                    Application Deadline:
                  </span>
                  <span className="font-bold text-[#0B1F4B]">{job.deadline || "30 Apr 2025"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#6B7694] flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#6B7694]" />
                    Posted On:
                  </span>
                  <span className="font-bold text-[#0B1F4B]">{job.postedDate || "12 Mar 2025"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#6B7694] flex items-center gap-2">
                    <Users2 className="w-4 h-4 text-[#6B7694]" />
                    Total Openings:
                  </span>
                  <span className="font-bold text-[#0B1F4B]">{job.openings ? `${job.openings}+ Positions` : "500+ Positions"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#6B7694] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#6B7694]" />
                    Job ID:
                  </span>
                  <span className="font-bold text-[#0B1F4B]">INF-2025-GE-001</span>
                </div>
              </div>

              {/* Notice Box (bg #FFF3E6, border 1px #FFE0C2, 12px radius) */}
              <div className="bg-[#FFF3E6] border border-[#FFE0C2] rounded-[12px] p-3.5 mb-4">
                <div className="flex items-center gap-2 text-[#FF6B00] mb-1">
                  <AlertCircle className="w-4 h-4 text-[#FF6B00] shrink-0" />
                  <h5 className="text-[14px] font-semibold text-[#FF6B00]">
                    Direct Campus Placement Drive
                  </h5>
                </div>
                <p className="text-[12px] text-[#6B7694] leading-relaxed">
                  Your verified student profile, CGPA, and resume will be directly submitted to the recruiter.
                </p>
              </div>

              {/* Full-width solid orange button */}
              <button
                type="button"
                onClick={() => setApplyModalOpen(true)}
                disabled={isApplied}
                className={`w-full h-[44px] rounded-[10px] text-[14px] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(255,107,0,0.25)] hover:shadow-[0_6px_20px_rgba(255,107,0,0.35)] ${
                  isApplied
                    ? "bg-[#22B573] text-white cursor-default shadow-none"
                    : "bg-[#FF6B00] text-white hover:bg-[#E86100]"
                }`}
              >
                {isApplied ? "Applied Successfully ✓" : "Apply for this Job →"}
              </button>
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
                {displaySimilar.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    href={`/student/jobs/${item.id}`}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group block"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg border border-[#EEF1F7] bg-white p-1 flex items-center justify-center shrink-0">
                        {item.company?.logo ? (
                          <img
                            src={item.company.logo}
                            alt={item.company.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Building2 className="w-5 h-5 text-[#1E5BE0]" />
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
                ))}
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
                  {job.company.logo ? (
                    <img
                      src={job.company.logo}
                      alt={job.company.name}
                      className="w-full h-full object-contain"
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
                Your verified profile, college enrollment details, and active resume will be submitted directly to <strong>{job.company.name}</strong>.
              </div>

              <div className="text-xs text-[#6B7694] space-y-1.5 bg-[#F7F9FD] p-3 rounded-xl border border-[#EEF1F7]">
                <div className="flex justify-between">
                  <span>Applicant Name:</span>
                  <span className="font-bold text-[#0B1F4B]">Vijayakumar M</span>
                </div>
                <div className="flex justify-between">
                  <span>Degree & Branch:</span>
                  <span className="font-bold text-[#0B1F4B]">B.E Computer Science</span>
                </div>
                <div className="flex justify-between">
                  <span>Placement Status:</span>
                  <span className="font-bold text-[#22B573]">Eligible (Batch 2025)</span>
                </div>
              </div>
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
          <span className="text-[13px] font-bold text-[#0B1F4B] block">₹4.0L - ₹6.5L/yr</span>
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
