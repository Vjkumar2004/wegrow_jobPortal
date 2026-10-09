"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Job } from "@/types";
import { hrService } from "@/services/hr.service";
import { formatDate, formatSalary, getCompanyLogoUrl, getCompanyLogoProxyUrl } from "@/lib/utils";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  Pause,
  Play,
  Trash2,
  ArrowLeft,
  Calendar,
  Building2,
  ExternalLink,
  Sparkles,
  FileText,
  Check,
  Layers,
} from "lucide-react";

interface HRJobDetailPageClientProps {
  job: Job;
}

export default function HRJobDetailPageClient({ job: initialJob }: HRJobDetailPageClientProps) {
  const router = useRouter();
  const [job, setJob] = useState<Job>(initialJob);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const isPublished = job.status === "Published";

  const toggleStatus = async () => {
    try {
      if (isPublished) {
        await hrService.pauseJob(job.id);
        setJob((prev) => ({ ...prev, status: "Paused" }));
        showToast("Job is now paused.");
      } else {
        await hrService.publishJob(job.id);
        setJob((prev) => ({ ...prev, status: "Published" }));
        showToast("Job is now published and active!");
      }
    } catch {
      showToast("Failed to update status. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to close "${job.title}"?`)) return;
    setIsDeleting(true);
    try {
      const ok = await hrService.closeJob(job.id);
      if (ok) {
        showToast("Job has been closed.");
        setTimeout(() => {
          router.push("/hr/jobs");
        }, 800);
      } else {
        showToast("Failed to close job.");
      }
    } catch {
      showToast("Failed to close job.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 font-['Poppins',sans-serif]">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1F4B] text-white px-5 py-3 rounded-xl shadow-xl border border-blue-400/20 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#22B573]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Back button */}
      <div>
        <Link
          href="/hr/jobs"
          className="inline-flex items-center text-xs font-bold text-[#6B7694] hover:text-[#1E5BE0] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to My Job Listings
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-[#EEF1F7] p-6 sm:p-8 shadow-[0_4px_14px_rgba(11,31,75,0.05)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0 border border-[#D5E4FF] shadow-xs">
              {job.company?.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getCompanyLogoUrl(job.company, job.company.id)}
                  alt={job.company.name}
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    const proxyUrl = job.company?.id ? getCompanyLogoProxyUrl(job.company.id) : "";
                    if (proxyUrl && target.src !== proxyUrl) {
                      target.src = proxyUrl;
                    } else {
                      target.style.display = "none";
                    }
                  }}
                />
              ) : (
                <Briefcase className="w-8 h-8" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E5BE0] bg-[#E8F0FF] px-2.5 py-0.5 rounded-full">
                  Corporate Vacancy
                </span>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    isPublished
                      ? "bg-[#E8F8EF] text-[#22B573] border border-[#C6F0D8]"
                      : "bg-[#FFF0E6] text-[#FF6B00] border border-[#FFE0CC]"
                  }`}
                >
                  {job.status}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4B] tracking-tight">
                {job.title}
              </h1>
              <p className="text-xs text-[#6B7694] font-medium mt-1">
                {job.company?.name || "Corporate Partner"} • Posted {formatDate(job.postedDate)}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={toggleStatus}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                isPublished
                  ? "bg-[#FFF0E6] text-[#FF6B00] hover:bg-[#ffe2cc] border border-[#FFE0CC]"
                  : "bg-[#E8F8EF] text-[#22B573] hover:bg-[#d4f2e0] border border-[#C6F0D8]"
              }`}
            >
              {isPublished ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Job</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Publish Job</span>
                </>
              )}
            </button>

            <Link
              href="/hr/applicants"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1E5BE0] hover:bg-[#1648b8] text-white transition shadow-sm cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Applicants ({job.applicantsCount || 0})</span>
            </Link>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2.5 rounded-xl text-[#6B7694] hover:text-[#EF4444] hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer disabled:opacity-40"
              title="Close Job"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#EEF1F7] shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B7694] uppercase tracking-wider">
            <DollarSign className="w-3.5 h-3.5 text-[#1E5BE0]" /> Salary / CTC
          </div>
          <p className="text-base font-extrabold text-[#0B1F4B] mt-1.5">
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#EEF1F7] shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B7694] uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" /> Experience
          </div>
          <p className="text-base font-extrabold text-[#0B1F4B] mt-1.5">
            {job.experience || "Fresher"}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#EEF1F7] shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B7694] uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" /> Work Mode & Location
          </div>
          <p className="text-base font-extrabold text-[#0B1F4B] mt-1.5">
            {job.workMode} • {job.location}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#EEF1F7] shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B7694] uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-[#22B573]" /> Openings
          </div>
          <p className="text-base font-extrabold text-[#0B1F4B] mt-1.5">
            {job.openings ? `${job.openings} Openings` : "Multiple"}
          </p>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="bg-white rounded-2xl border border-[#EEF1F7] p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Description */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7694] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#1E5BE0]" /> Role Overview
          </h2>
          <div className="text-xs sm:text-sm text-[#2D3748] leading-relaxed bg-[#F8FAFD] p-5 rounded-xl border border-[#EEF1F7] whitespace-pre-line">
            {job.description || "No full description provided for this job opening."}
          </div>
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7694] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" /> Required Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 bg-[#E8F0FF] text-[#1E5BE0] text-xs font-semibold rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7694] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22B573]" /> Key Responsibilities
            </h2>
            <ul className="space-y-2">
              {job.responsibilities.map((resp, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-[#2D3748] bg-[#F8FAFD] p-3 rounded-lg border border-[#EEF1F7]"
                >
                  <Check className="w-4 h-4 text-[#22B573] shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7694] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#8B5CF6]" /> Requirements & Eligibility
            </h2>
            <ul className="space-y-2">
              {job.requirements.map((req, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-[#2D3748] bg-[#F8FAFD] p-3 rounded-lg border border-[#EEF1F7]"
                >
                  <div className="w-2 h-2 rounded-full bg-[#8B5CF6] shrink-0 mt-1.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hiring Company Details */}
        {job.company && (
          <div className="border-t border-[#EEF1F7] pt-5 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7694] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#1E5BE0]" /> Hiring Organization
            </h2>
            <div className="bg-[#F8FAFD] p-5 rounded-xl border border-[#EEF1F7] text-xs text-[#2D3748] space-y-1.5">
              <p className="font-bold text-[#0B1F4B] text-sm">{job.company.name}</p>
              <p className="text-[#6B7694]">
                {job.company.location || job.location} • {job.company.industry || "Information Technology"}
              </p>
              {job.company.about && <p className="pt-1 text-[#4A5568]">{job.company.about}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
