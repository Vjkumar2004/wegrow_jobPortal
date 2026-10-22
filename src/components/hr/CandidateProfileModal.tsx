"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  FolderGit2,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  FileText,
  Calendar,
  CheckCircle2,
  Award,
  BookOpen,
  Eye,
  Building,
  DollarSign,
  Compass,
  Clock,
  UserCheck,
} from "lucide-react";
import { Application } from "@/types";
import { hrService } from "@/services/hr.service";
import { getNameInitials, getAvatarUrl } from "@/lib/utils";

interface CandidateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onStatusChange?: (appId: string, newStatus: string) => void;
  onScheduleInterview?: (app: Application) => void;
  onDownloadResume?: (app: Application) => void;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  isOpen,
  onClose,
  application,
  onStatusChange,
  onScheduleInterview,
  onDownloadResume,
}) => {
  const [details, setDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "preferences" | "projects" | "experience" | "education" | "skills"
  >("overview");

  useEffect(() => {
    if (!isOpen || !application) {
      setDetails(null);
      return;
    }

    // 1. Preload with local profile data from applicant item
    setDetails(application.studentProfile || null);

    // 2. Record Profile View (increments student dashboard profileViews counter)
    const targetId =
      application.applicantId ||
      application.studentProfile?.id ||
      (application as any)?.studentId ||
      "";
    const targetEmail =
      application.applicantEmail ||
      application.studentProfile?.email ||
      application.studentProfile?.user?.email ||
      "";
    const targetName =
      application.applicantName ||
      application.studentProfile?.fullName ||
      "Candidate";

    hrService.recordCandidateProfileView(targetId, targetEmail, targetName);

    // 3. Fetch comprehensive details from backend
    setIsLoading(true);
    hrService
      .getApplicationDetail(application.id)
      .then((res) => {
        // Backend returns { application: { candidate: { ... } } } or { candidate: { ... } } or { student: { ... } }
        const cand =
          res?.candidate ||
          res?.application?.candidate ||
          res?.student ||
          res?.application?.student ||
          res?.studentProfile ||
          (res?.fullName ? res : null);

        if (cand) {
          const resolvedId = cand.id || targetId;
          const resolvedEmail = cand.email || targetEmail;
          const resolvedName = cand.fullName || targetName;
          if (resolvedId || resolvedEmail) {
            hrService.recordCandidateProfileView(resolvedId, resolvedEmail, resolvedName);
          }

          setDetails((prev: any) => ({
            ...(prev || {}),
            ...cand,
            projects:
              cand.projects && cand.projects.length > 0
                ? cand.projects
                : prev?.projects || [],
            experiences:
              cand.experiences && cand.experiences.length > 0
                ? cand.experiences
                : prev?.experiences || [],
            educations:
              cand.educations && cand.educations.length > 0
                ? cand.educations
                : prev?.educations || [],
            skills:
              cand.skills && cand.skills.length > 0
                ? cand.skills
                : prev?.skills || [],
            careerPreferences:
              cand.careerPreferences || prev?.careerPreferences || null,
          }));
        }
      })
      .catch((err) => {
        console.warn("Could not load candidate full application detail:", err);
      })
      .finally(() => setIsLoading(false));
  }, [isOpen, application]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !application) return null;

  const student = details || application.studentProfile || {};
  const educations: any[] = student.educations || student.education || [];
  const experiences: any[] = student.experiences || student.experience || [];
  const projects: any[] = student.projects || [];
  const rawSkills: any[] = student.studentSkills || student.skills || [];
  const skills: string[] = rawSkills
    .map((s) => (typeof s === "string" ? s : s.skill?.name || s.name || ""))
    .filter(Boolean);

  // Parse Career Preferences (supports object or stringified JSON)
  const careerPreferences: any = (() => {
    const raw = student.careerPreferences;
    if (!raw) return null;
    if (typeof raw === "object") return raw;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  })();

  const headline =
    student.headline || application.applicantExperience || "Aspiring Professional";
  const bio = student.bio || "No summary bio provided yet by the candidate.";
  const college =
    student.currentCollege ||
    application.applicantCollege ||
    educations[0]?.institution ||
    "Campus Student";
  const degree =
    student.degree || educations[0]?.degree || "Degree Program";
  const cgpa = student.cgpa || educations[0]?.grade || educations[0]?.cgpa;
  const gradYear =
    student.graduationYear ||
    application.applicantGradYear ||
    (educations[0]?.endDate ? new Date(educations[0].endDate).getFullYear() : null);

  const candidateEmail = student.email || application.applicantEmail;
  const candidatePhone = student.phone || application.applicantPhone;
  const candidateLocation = student.location || "Location not specified";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-['Poppins',sans-serif]">
      {/* 1. Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Slide-Over Right Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 z-50">
        <div
          className="w-screen max-w-2xl sm:max-w-3xl lg:max-w-4xl bg-white shadow-2xl flex flex-col border-l border-slate-200 transition-transform duration-300 ease-out transform translate-x-0 animate-in slide-in-from-right"
          role="dialog"
          aria-modal="true"
        >
          {/* Top Loading Progress Indicator */}
          {isLoading && (
            <div className="w-full bg-slate-100 h-1 overflow-hidden shrink-0">
              <div className="bg-[#1E5BE0] h-full w-full animate-pulse" />
            </div>
          )}

          {/* Header Profile Section - Crisp White Theme */}
          <div className="bg-white border-b border-slate-200 p-5 sm:p-6 shrink-0 relative">
            <div className="flex items-start justify-between gap-4">
              {/* Candidate Avatar & Core Info */}
              <div className="flex items-start gap-4 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 p-1 border-2 border-slate-200 shadow-xs overflow-hidden">
                    <div className="w-full h-full rounded-xl bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center overflow-hidden font-black text-xl text-[#0B1F4B]">
                      {application.applicantAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={application.applicantAvatar}
                          alt={application.applicantName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const fallback = application.applicantId
                              ? getAvatarUrl(application.applicantId)
                              : "";
                            if (fallback && e.currentTarget.src !== fallback) {
                              e.currentTarget.src = fallback;
                              return;
                            }
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span>{getNameInitials(application.applicantName)}</span>
                      )}
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
                    <UserCheck className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-[#0B1F4B] tracking-tight truncate">
                      {application.applicantName}
                    </h2>
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                      <Eye className="w-3 h-3 text-emerald-600" /> Profile Viewed
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 font-semibold truncate">
                    {headline}
                  </p>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 pt-1">
                    {candidateEmail && (
                      <span className="inline-flex items-center gap-1 hover:text-[#1E5BE0]">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <a href={`mailto:${candidateEmail}`}>{candidateEmail}</a>
                      </span>
                    )}
                    {candidatePhone && (
                      <span className="inline-flex items-center gap-1 hover:text-[#1E5BE0]">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <a href={`tel:${candidatePhone}`}>{candidatePhone}</a>
                      </span>
                    )}
                    {candidateLocation && (
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{candidateLocation}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Close Drawer Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Ribbon */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="bg-blue-50 text-[#1E5BE0] border border-blue-100 px-3 py-1 rounded-lg font-bold">
                  Applied for: {application.jobTitle}
                </span>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium text-[11px]">
                  {college}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onDownloadResume && (
                  <button
                    type="button"
                    onClick={() => onDownloadResume(application)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-[#0B1F4B] border border-slate-300 text-xs font-bold rounded-xl transition shadow-2xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#1E5BE0]" />
                    <span>View CV / Resume</span>
                  </button>
                )}
                {onScheduleInterview && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onScheduleInterview(application);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1E5BE0] hover:bg-[#1647b8] text-white text-xs font-extrabold rounded-xl transition shadow-xs cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Interview</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs - Modern White & Light Gray Strip */}
          <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 sm:px-6 text-xs font-bold text-slate-500 shrink-0 overflow-x-auto scrollbar-none gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "overview"
                  ? "border-[#1E5BE0] text-[#1E5BE0] font-extrabold bg-white rounded-t-lg"
                  : "border-transparent hover:text-[#0B1F4B]"
              }`}
            >
              Overview & Bio
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preferences")}
              className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "preferences"
                  ? "border-[#1E5BE0] text-[#1E5BE0] font-extrabold bg-white rounded-t-lg"
                  : "border-transparent hover:text-[#0B1F4B]"
              }`}
            >
              Job Preferences
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "projects"
                  ? "border-[#1E5BE0] text-[#1E5BE0] font-extrabold bg-white rounded-t-lg"
                  : "border-transparent hover:text-[#0B1F4B]"
              }`}
            >
              <span>Projects</span>
              <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {projects.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("experience")}
              className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "experience"
                  ? "border-[#1E5BE0] text-[#1E5BE0] font-extrabold bg-white rounded-t-lg"
                  : "border-transparent hover:text-[#0B1F4B]"
              }`}
            >
              <span>Internships & Experience</span>
              <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {experiences.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("education")}
              className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "education"
                  ? "border-[#1E5BE0] text-[#1E5BE0] font-extrabold bg-white rounded-t-lg"
                  : "border-transparent hover:text-[#0B1F4B]"
              }`}
            >
              <span>Education</span>
              <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {educations.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("skills")}
              className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "skills"
                  ? "border-[#1E5BE0] text-[#1E5BE0] font-extrabold bg-white rounded-t-lg"
                  : "border-transparent hover:text-[#0B1F4B]"
              }`}
            >
              <span>Skills</span>
              <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {skills.length}
              </span>
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-slate-700 bg-white">
            {/* TAB 1: OVERVIEW & BIO */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Professional Bio */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <h4 className="font-bold text-[#0B1F4B] text-xs uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#1E5BE0]" />
                    <span>Professional Summary & Bio</span>
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600 whitespace-pre-line font-normal">
                    {bio}
                  </p>
                </div>

                {/* Quick Academic & Career Snapshot */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                      <GraduationCap className="w-4 h-4 text-[#1E5BE0]" />
                      <span>Degree</span>
                    </div>
                    <p className="font-bold text-[#0B1F4B] text-sm mt-1.5 truncate">
                      {degree}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>CGPA / Grade</span>
                    </div>
                    <p className="font-bold text-[#0B1F4B] text-sm mt-1.5">
                      {cgpa ? `${cgpa} CGPA` : "Not provided"}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                      <Calendar className="w-4 h-4 text-amber-500" />
                      <span>Graduation Year</span>
                    </div>
                    <p className="font-bold text-[#0B1F4B] text-sm mt-1.5">
                      {gradYear || "2026"}
                    </p>
                  </div>
                </div>

                {/* Key Skills Highlight */}
                <div>
                  <h4 className="font-bold text-[#0B1F4B] text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#1E5BE0]" />
                    <span>Top Skills</span>
                  </h4>
                  {skills.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No skills added yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {skills.slice(0, 12).map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-50 text-[#1E5BE0] border border-blue-200 rounded-xl text-xs font-bold shadow-2xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {skills.length > 12 && (
                        <button
                          type="button"
                          onClick={() => setActiveTab("skills")}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          +{skills.length - 12} more
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Social & Portfolio Links */}
                {(student.linkedInUrl || student.githubUrl || student.portfolioUrl) && (
                  <div>
                    <h4 className="font-bold text-[#0B1F4B] text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#1E5BE0]" />
                      <span>Verified Portfolios & Links</span>
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {student.linkedInUrl && (
                        <a
                          href={student.linkedInUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0077b5]/10 text-[#0077b5] border border-[#0077b5]/30 rounded-xl text-xs font-bold hover:bg-[#0077b5] hover:text-white transition shadow-2xs"
                        >
                          <Linkedin className="w-4 h-4" />
                          <span>LinkedIn Profile</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      )}
                      {student.githubUrl && (
                        <a
                          href={student.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold hover:bg-slate-900 hover:text-white transition shadow-2xs"
                        >
                          <Github className="w-4 h-4" />
                          <span>GitHub Repositories</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      )}
                      {student.portfolioUrl && (
                        <a
                          href={student.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-3.5 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold hover:bg-purple-600 hover:text-white transition shadow-2xs"
                        >
                          <Globe className="w-4 h-4" />
                          <span>Personal Portfolio</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: JOB PREFERENCES */}
            {activeTab === "preferences" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <h4 className="font-bold text-[#0B1F4B] text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#1E5BE0]" />
                    <span>Candidate Career & Job Preferences</span>
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    Specific requirements and preferences selected by the candidate during profile setup.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Preferred Roles */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Target Roles / Designation
                      </span>
                      <p className="font-bold text-sm text-[#0B1F4B]">
                        {careerPreferences?.preferredRoles ||
                          student.preferredRoles ||
                          headline ||
                          "Any suitable engineering role"}
                      </p>
                    </div>

                    {/* Preferred Locations */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Preferred Work Locations
                      </span>
                      <p className="font-bold text-sm text-[#0B1F4B] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>
                          {careerPreferences?.preferredLocations ||
                            student.preferredLocations ||
                            student.location ||
                            "Open to Pan-India / Remote"}
                        </span>
                      </p>
                    </div>

                    {/* Employment Type */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Employment Type
                      </span>
                      <p className="font-bold text-sm text-[#0B1F4B] flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-[#1E5BE0] shrink-0" />
                        <span>
                          {careerPreferences?.employmentType ||
                            student.employmentType ||
                            "Full-Time / Internship"}
                        </span>
                      </p>
                    </div>

                    {/* Expected Salary */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Expected Compensation
                      </span>
                      <p className="font-bold text-sm text-emerald-600 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>
                          {careerPreferences?.expectedSalary ||
                            student.expectedSalary ||
                            "As per company standard / negotiable"}
                        </span>
                      </p>
                    </div>

                    {/* Joining Timeline */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 sm:col-span-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Availability / Notice Period
                      </span>
                      <p className="font-bold text-sm text-[#0B1F4B] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>
                          {careerPreferences?.joiningTimeline ||
                            student.joiningTimeline ||
                            "Immediate / 15 Days"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PROJECTS */}
            {activeTab === "projects" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {projects.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <FolderGit2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600 text-sm">
                      No personal projects added yet
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Candidate has not filled any personal or academic projects in their profile.
                    </p>
                  </div>
                ) : (
                  projects.map((proj: any, i: number) => {
                    const projSkills: string[] = Array.isArray(proj.skills)
                      ? proj.skills
                      : typeof proj.skills === "string"
                      ? proj.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
                      : [];

                    const demoUrl = proj.link || proj.projectUrl || proj.liveUrl || proj.url;
                    const repoUrl = proj.repoUrl || proj.githubUrl;

                    return (
                      <div
                        key={i}
                        className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#1E5BE0]/40 transition space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-[#0B1F4B] text-base">
                              {proj.title}
                            </h4>
                            {proj.subtitle && (
                              <p className="text-xs text-[#1E5BE0] font-semibold">
                                {proj.subtitle}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {demoUrl && (
                              <a
                                href={demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white border border-blue-200 rounded-xl text-xs font-bold transition cursor-pointer"
                              >
                                <span>Live Demo</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {repoUrl && (
                              <a
                                href={repoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white border border-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
                              >
                                <Github className="w-3.5 h-3.5" />
                                <span>Code</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {proj.description && (
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                            {proj.description}
                          </p>
                        )}

                        {projSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {projSkills.map((s, idx) => (
                              <span
                                key={idx}
                                className="bg-slate-100 text-slate-700 border border-slate-200 text-[11px] px-2.5 py-0.5 rounded-lg font-semibold"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 4: INTERNSHIPS & EXPERIENCE */}
            {activeTab === "experience" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {experiences.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Briefcase className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600 text-sm">
                      No internships or work experience added
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Candidate is a fresh graduate or hasn&apos;t added prior internship records.
                    </p>
                  </div>
                ) : (
                  experiences.map((exp: any, i: number) => {
                    const startText = exp.startDate
                      ? new Date(exp.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "";
                    const endText =
                      exp.current || exp.isCurrent || !exp.endDate
                        ? "Present"
                        : new Date(exp.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          });

                    return (
                      <div
                        key={i}
                        className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#1E5BE0]/40 transition space-y-2"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="font-bold text-[#0B1F4B] text-base">
                            {exp.role || exp.title || exp.position || "Intern"}
                          </h4>
                          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 w-fit">
                            {startText} - {endText}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-[#1E5BE0] flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5" />
                          <span>{exp.company || exp.organization || "Company"}</span>
                          {exp.location && (
                            <span className="text-slate-400 font-normal">
                              • {exp.location}
                            </span>
                          )}
                        </p>

                        {exp.description && (
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line pt-1">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 5: EDUCATION */}
            {activeTab === "education" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {educations.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <GraduationCap className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600 text-sm">
                      No education records found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Candidate has not added their degree or college details.
                    </p>
                  </div>
                ) : (
                  educations.map((edu: any, i: number) => {
                    const startYear =
                      edu.startYear ||
                      (edu.startDate ? new Date(edu.startDate).getFullYear() : null);
                    const endYear =
                      edu.endYear ||
                      (edu.endDate ? new Date(edu.endDate).getFullYear() : "Present");

                    return (
                      <div
                        key={i}
                        className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-[#0B1F4B] text-base">
                            {edu.degree || edu.course || "Degree Program"}
                          </h4>
                          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                            {startYear ? `${startYear} - ` : ""}
                            {endYear}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-[#1E5BE0]">
                          {edu.institution || edu.institutionName || college}
                        </p>

                        {edu.fieldOfStudy && (
                          <p className="text-xs text-slate-500 font-medium">
                            Field of Study: {edu.fieldOfStudy}
                          </p>
                        )}

                        {(edu.grade || edu.cgpa) && (
                          <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg mt-1">
                            CGPA / Grade: {edu.grade || edu.cgpa}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 6: SKILLS */}
            {activeTab === "skills" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <h4 className="font-bold text-[#0B1F4B] text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#1E5BE0]" />
                    <span>Candidate Verified Technical & Soft Skills</span>
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    All competencies submitted and tagged by the candidate.
                  </p>

                  {skills.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No skills listed.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2.5">
                      {skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-white text-[#0B1F4B] border border-slate-300 rounded-xl text-xs font-bold shadow-2xs hover:border-[#1E5BE0] transition"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Ribbon: Status Update & Dismiss */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Application Status:
              </span>
              {onStatusChange ? (
                <select
                  value={application.status}
                  onChange={(e) => onStatusChange(application.id, e.target.value)}
                  className="bg-white text-xs font-bold text-[#0B1F4B] px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/30 cursor-pointer shadow-2xs"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              ) : (
                <span className="bg-blue-100 text-[#1E5BE0] text-xs font-bold px-3 py-1 rounded-lg">
                  {application.status}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
