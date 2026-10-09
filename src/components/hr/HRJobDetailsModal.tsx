"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Job } from "@/types";
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
  X,
  ExternalLink,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  FileText,
  Check,
} from "lucide-react";

interface HRJobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleStatus?: (jobId: string) => void;
  onDeleteJob?: (jobId: string, jobTitle: string) => void;
  isDeleting?: boolean;
}

export default function HRJobDetailsModal({
  job,
  isOpen,
  onClose,
  onToggleStatus,
  onDeleteJob,
  isDeleting = false,
}: HRJobDetailsModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  const isPublished = job.status === "Published";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0B1F4B]/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-job-title"
    >
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-[#EEF1F7] flex flex-col overflow-hidden z-10 font-['Poppins',sans-serif]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EEF1F7] bg-linear-to-r from-[#F8FAFD] to-white flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0 border border-[#D5E4FF] shadow-xs">
              {job.company?.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getCompanyLogoUrl(job.company, job.company.id)}
                  alt={job.company.name}
                  className="w-full h-full object-cover rounded-xl"
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
                <Briefcase className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E5BE0] bg-[#E8F0FF] px-2.5 py-0.5 rounded-full">
                  Corporate Vacancy Preview
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

              <h2
                id="modal-job-title"
                className="text-xl sm:text-2xl font-extrabold text-[#0B1F4B] tracking-tight leading-snug"
              >
                {job.title}
              </h2>
              <p className="text-xs text-[#6B7694] font-medium mt-0.5">
                {job.company?.name || "Corporate Partner"} • Posted {formatDate(job.postedDate)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#6B7694] hover:text-[#0B1F4B] hover:bg-[#F1F4F9] transition cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#F8FAFD] rounded-xl p-3 border border-[#EEF1F7]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B7694] uppercase tracking-wider">
                <DollarSign className="w-3.5 h-3.5 text-[#1E5BE0]" />
                <span>Salary / CTC</span>
              </div>
              <p className="text-sm font-extrabold text-[#0B1F4B] mt-1 truncate">
                {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
              </p>
            </div>

            <div className="bg-[#F8FAFD] rounded-xl p-3 border border-[#EEF1F7]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B7694] uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Experience</span>
              </div>
              <p className="text-sm font-extrabold text-[#0B1F4B] mt-1 truncate">
                {job.experience || "Fresher"}
              </p>
            </div>

            <div className="bg-[#F8FAFD] rounded-xl p-3 border border-[#EEF1F7]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B7694] uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Location & Mode</span>
              </div>
              <p className="text-sm font-extrabold text-[#0B1F4B] mt-1 truncate">
                {job.workMode} • {job.location}
              </p>
            </div>

            <div className="bg-[#F8FAFD] rounded-xl p-3 border border-[#EEF1F7]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B7694] uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-[#22B573]" />
                <span>Openings</span>
              </div>
              <p className="text-sm font-extrabold text-[#0B1F4B] mt-1 truncate">
                {job.openings ? `${job.openings} Vacanc${job.openings > 1 ? "ies" : "y"}` : "Multiple"}
              </p>
            </div>
          </div>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-lg bg-[#E8F0FF] text-[#1E5BE0] font-semibold">
              Type: {job.jobType}
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#F1F4F9] text-[#0B1F4B] font-semibold">
              Mode: {job.workMode}
            </span>
            {job.deadline && (
              <span className="px-3 py-1 rounded-lg bg-[#FFF0E6] text-[#FF6B00] font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Deadline: {formatDate(job.deadline)}
              </span>
            )}
          </div>

          {/* Applications Banner */}
          <div className="bg-linear-to-r from-[#1E5BE0]/10 via-[#E8F0FF] to-[#22B573]/10 rounded-xl p-4 border border-[#1E5BE0]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1E5BE0] text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
                {job.applicantsCount || 0}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0B1F4B]">
                  Candidate Applications Received
                </h4>
                <p className="text-xs text-[#6B7694]">
                  Students actively applied and awaiting resume screening or interview rounds.
                </p>
              </div>
            </div>

            <Link
              href={`/hr/applicants`}
              className="inline-flex items-center justify-center gap-1.5 bg-[#1E5BE0] hover:bg-[#1648b8] text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-xs shrink-0"
              onClick={onClose}
            >
              <span>Review Candidates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7694] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#1E5BE0]" /> Role Overview & Description
            </h3>
            <div className="text-xs sm:text-[13px] text-[#2D3748] leading-relaxed bg-[#F8FAFD] p-4 rounded-xl border border-[#EEF1F7] whitespace-pre-line">
              {job.description || "No full description provided for this job opening."}
            </div>
          </div>

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7694] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" /> Required Skills & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white border border-[#D5E4FF] text-[#1E5BE0] text-xs font-semibold rounded-lg shadow-2xs hover:bg-[#E8F0FF] transition"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7694] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22B573]" /> Key Responsibilities
              </h3>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-[13px] text-[#2D3748] bg-[#F8FAFD] p-2.5 rounded-lg border border-[#EEF1F7]"
                  >
                    <Check className="w-4 h-4 text-[#22B573] shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements & Qualifications */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7694] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#8B5CF6]" /> Eligibility & Requirements
              </h3>
              <ul className="space-y-2">
                {job.requirements.map((req, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-[13px] text-[#2D3748] bg-[#F8FAFD] p-2.5 rounded-lg border border-[#EEF1F7]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] shrink-0 mt-1.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Company Details */}
          {job.company && (
            <div className="border-t border-[#EEF1F7] pt-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7694] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#1E5BE0]" /> Hiring Company Overview
              </h3>
              <div className="bg-[#F8FAFD] p-4 rounded-xl border border-[#EEF1F7] text-xs text-[#2D3748] space-y-1.5">
                <p className="font-bold text-[#0B1F4B] text-sm">{job.company.name}</p>
                <p className="text-[#6B7694]">
                  {job.company.location || job.location} • {job.company.industry || "Information Technology"}
                </p>
                {job.company.about && <p className="pt-1 text-[#4A5568]">{job.company.about}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Action Toolbar */}
        <div className="p-3.5 sm:p-5 border-t border-[#EEF1F7] bg-[#F8FAFD] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Toggle Status (Pause / Publish) */}
            {onToggleStatus && (
              <button
                type="button"
                onClick={() => onToggleStatus(job.id)}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isPublished
                    ? "bg-[#FFF0E6] text-[#FF6B00] hover:bg-[#ffe2cc] border border-[#FFE0CC]"
                    : "bg-[#E8F8EF] text-[#22B573] hover:bg-[#d4f2e0] border border-[#C6F0D8]"
                }`}
              >
                {isPublished ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Job</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Publish Job</span>
                  </>
                )}
              </button>
            )}

            {/* Close / Delete Job Opening */}
            {onDeleteJob && (
              <button
                type="button"
                onClick={() => onDeleteJob(job.id, job.title)}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#EF4444] bg-white hover:bg-rose-50 border border-rose-200 transition cursor-pointer disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Close</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Optional Public Preview Link in New Tab */}
            <a
              href={`/jobs/${job.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B7694] hover:text-[#1E5BE0] transition px-2 py-2"
              title="Open public candidate view in a separate tab"
            >
              <span>Public Preview</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#D5E4FF] text-xs font-bold text-[#0B1F4B] hover:bg-[#F1F4F9] transition cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
