"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { StudentProfile } from "@/types";
import Link from "next/link";
import {
  FileText,
  Clock,
  Users,
  Calendar,
  Star,
  Search,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Check,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Briefcase,
  Lightbulb,
  ArrowRight,
  Filter,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { StudentApplicationsPageData, StudentApplicationTrackerItem } from "@/types";
import { applicationsService } from "@/services/applications.service";

const DEFAULT_APPLICATIONS_DATA: StudentApplicationsPageData = {
  stats: { totalApplied: 0, underReview: 0, shortlisted: 0, interviews: 0, selected: 0, rejected: 0 },
  monthlyStats: [],
  applications: [],
  topCompaniesApplied: [],
  profileCompletion: { percentage: 0, checklist: [] },
};

interface StudentApplicationsClientProps {
  initialData?: StudentApplicationsPageData;
}

export default function StudentApplicationsClient({ initialData = DEFAULT_APPLICATIONS_DATA }: StudentApplicationsClientProps) {
  const queryClient = useQueryClient();

  const { data = initialData, isPending } = useQuery({
    queryKey: ["student-applications"],
    queryFn: () => {
      const cachedProfile = queryClient.getQueryData<StudentProfile>(["student-profile"]);
      return applicationsService.getStudentApplicationsPageData(cachedProfile ?? undefined);
    },
    initialData,
    staleTime: 60_000,
  });

  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Most Recent");
  const [statsPeriod, setStatsPeriod] = useState("Last 6 Months");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedAppForDrawer, setSelectedAppForDrawer] = useState<StudentApplicationTrackerItem | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Status Tab filters
  const tabs = [
    { label: "All", count: data.stats.totalApplied },
    { label: "Under Review", count: data.stats.underReview },
    { label: "Shortlisted", count: data.stats.shortlisted },
    { label: "Interview", count: data.stats.interviews },
    { label: "Selected", count: data.stats.selected },
    { label: "Rejected", count: data.stats.rejected },
  ];

  // Helper for status pills exactly matching prompt specifications
  const getStatusPillClasses = (status: string) => {
    switch (status) {
      case "Interview":
      case "Under Review":
        return "bg-[#DCEBFF] text-[#1E5BE0]";
      case "Shortlisted":
      case "Applied":
        return "bg-[#DDF5E8] text-[#1E9E63]";
      case "Selected":
        return "bg-[#FFF1D6] text-[#D98A00]";
      case "Rejected":
        return "bg-[#FFE0E0] text-[#D93636]";
      default:
        return "bg-[#F1F4F9] text-[#6B7694]";
    }
  };

  // Filtered + sorted applications list
  const filteredApps = data.applications
    .filter((app) => {
      if (activeTab !== "All" && app.status.toLowerCase() !== activeTab.toLowerCase()) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        if (
          !app.title.toLowerCase().includes(q) &&
          !app.companyName.toLowerCase().includes(q) &&
          !(app.location || "").toLowerCase().includes(q)
        ) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "Oldest First") return new Date(a.appliedDateText).getTime() - new Date(b.appliedDateText).getTime();
      if (sortBy === "Status") return a.status.localeCompare(b.status);
      return new Date(b.appliedDateText).getTime() - new Date(a.appliedDateText).getTime();
    });

  // Show skeleton while first fetch is in progress
  if (isPending) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-7 space-y-5 animate-pulse">
        <div className="h-10 w-52 rounded-xl bg-[#EEF1F7]" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white border border-[#EEF1F7]" />
          ))}
        </div>
        <div className="h-12 rounded-xl bg-white border border-[#EEF1F7]" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 rounded-2xl bg-white border border-[#EEF1F7]" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col xl:flex-row min-w-0 p-4 sm:p-6 lg:p-7 gap-5 overflow-hidden font-['Poppins',sans-serif] text-[#0B1F4B]">
      {/* ================= ZONE 2: CENTER CONTENT (flexible, gap 20px) ================= */}
      <main className="flex-1 min-w-0 space-y-5">
        {/* 1. Page Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[36px] font-[800] text-[#0B1F4B] tracking-tight leading-tight">
              My Applications
            </h1>
            <p className="text-[14px] sm:text-[16px] text-[#6B7694] mt-1">
              Track and manage all your job applications in one place.
            </p>
          </div>

          <Link
            href="/student/jobs"
            className="inline-flex items-center justify-center gap-2 bg-[#1E5BE0] hover:bg-[#1548b8] text-white font-[600] text-[14px] px-[20px] py-[10px] rounded-[8px] transition-all shadow-sm self-start sm:self-auto shrink-0 cursor-pointer"
          >
            <span>Explore Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2. Five Stat Cards in a row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* Card 1: Blue Tint - Total Applied */}
          <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] bg-gradient-to-br from-blue-50/50 to-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-3.5">
            <div className="w-[56px] h-[56px] rounded-2xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[26px] font-[700] text-[#0B1F4B] leading-none">
                {data.stats.totalApplied}
              </div>
              <div className="text-[14px] text-[#6B7694] mt-1">Total Applied</div>
              <div className="text-[12px] text-[#6B7694] flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-[#1E5BE0]" /> +3 this month
              </div>
            </div>
          </div>

          {/* Card 2: Orange Tint - Under Review */}
          <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] bg-gradient-to-br from-orange-50/50 to-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-3.5">
            <div className="w-[56px] h-[56px] rounded-2xl bg-[#FFF0E6] text-[#FF6B00] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[26px] font-[700] text-[#0B1F4B] leading-none">
                {data.stats.underReview}
              </div>
              <div className="text-[14px] text-[#6B7694] mt-1">Under Review</div>
              <div className="text-[12px] text-[#6B7694] flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-[#1E5BE0]" /> +2 this month
              </div>
            </div>
          </div>

          {/* Card 3: Green Tint - Shortlisted */}
          <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] bg-gradient-to-br from-emerald-50/50 to-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-3.5">
            <div className="w-[56px] h-[56px] rounded-2xl bg-[#E8F8F1] text-[#22B573] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[26px] font-[700] text-[#0B1F4B] leading-none">
                {data.stats.shortlisted}
              </div>
              <div className="text-[14px] text-[#6B7694] mt-1">Shortlisted</div>
              <div className="text-[12px] text-[#6B7694] flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-[#1E5BE0]" /> +1 this month
              </div>
            </div>
          </div>

          {/* Card 4: Purple Tint - Interviews */}
          <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] bg-gradient-to-br from-purple-50/50 to-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-3.5">
            <div className="w-[56px] h-[56px] rounded-2xl bg-[#F3EEFF] text-[#8B5CF6] flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[26px] font-[700] text-[#0B1F4B] leading-none">
                {data.stats.interviews}
              </div>
              <div className="text-[14px] text-[#6B7694] mt-1">Interviews</div>
              <div className="text-[12px] text-[#6B7694] flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-[#1E5BE0]" /> +1 this month
              </div>
            </div>
          </div>

          {/* Card 5: Peach Tint - Selected / Offers */}
          <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] bg-gradient-to-br from-amber-50/50 to-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-3.5 col-span-2 sm:col-span-1">
            <div className="w-[56px] h-[56px] rounded-2xl bg-[#FFF6E5] text-[#D98A00] flex items-center justify-center shrink-0">
              <Star className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[26px] font-[700] text-[#0B1F4B] leading-none">
                {data.stats.selected}
              </div>
              <div className="text-[14px] text-[#6B7694] mt-1">Selected / Offers</div>
              <div className="text-[12px] text-[#6B7694] flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-[#1E5BE0]" /> +1 this month
              </div>
            </div>
          </div>
        </div>

        {/* 3. Status Tabs Row (fully rounded, 40px height, Poppins 500, 14px) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.label;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveTab(tab.label)}
                className={`h-[40px] px-5 rounded-full text-[14px] font-[500] transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#1E5BE0] text-white shadow-xs"
                    : "bg-white text-[#0B1F4B] border border-[#EEF1F7] hover:border-[#1E5BE0]"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>

        {/* 4. Search and Sort Bar */}
        <div className="bg-white rounded-[14px] p-3.5 sm:p-4 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search applications, companies or job titles..."
              className="w-full h-[44px] bg-[#F4F6FA] text-sm text-[#0B1F4B] placeholder-[#6B7694] pl-10 pr-4 rounded-[10px] border border-[#E3E8F0] focus:outline-none focus:border-[#1E5BE0] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 text-xs">
            <span className="text-[#6B7694] font-medium">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#E3E8F0] text-[13px] font-medium text-[#0B1F4B] rounded-[10px] pl-3 pr-8 py-2 appearance-none focus:outline-none focus:border-[#1E5BE0] cursor-pointer"
              >
                <option value="Most Recent">Most Recent</option>
                <option value="Oldest First">Oldest First</option>
                <option value="Status">Status</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#6B7694] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 5. Application Cards List (Stacked, gap 12px) */}
        {filteredApps.length === 0 ? (
          <div className="bg-white rounded-[14px] p-12 text-center border border-[#EEF1F7] shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#0B1F4B]">No applications match your filter</h3>
            <p className="text-sm text-[#6B7694] mt-1 max-w-sm mx-auto">
              Try switching tabs or searching with different keywords.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:border-[#1E5BE0]/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md space-y-4"
              >
                {/* Top Section */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: Company Logo Tile (~90px wide) + Middle Info */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-[80px] sm:w-[90px] h-[64px] rounded-[10px] border border-[#EEF1F7] bg-white p-1.5 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-sm ${
                        app.companyLogoBg || "bg-[#F7F9FD] text-[#1E5BE0]"
                      }`}
                    >
                      {app.companyLogo && !failedImages[app.id] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={app.companyLogo}
                          alt={app.companyName}
                            className="w-full h-full object-contain p-1"
                          onError={() => {
                            setFailedImages((prev) => ({ ...prev, [app.id]: true }));
                          }}
                        />
                      ) : (
                        <span className="font-bold text-sm text-[#1E5BE0]">{app.companyInitials || app.companyName.slice(0, 3).toUpperCase()}</span>
                      )}
                    </div>

                    <div>
                      {/* Job Title (Poppins 700, 17px, navy) */}
                      <h3 className="font-[700] text-[17px] text-[#0B1F4B] leading-snug hover:text-[#1E5BE0] transition-colors">
                        <Link href={`/student/jobs/${app.jobId}`}>{app.title}</Link>
                      </h3>

                      {/* Company - Applied on Date */}
                      <p className="text-[13px] mt-1">
                        <span className="font-[700] text-[#0B1F4B]">{app.companyName}</span>
                        <span className="text-[#6B7694]"> - Applied on {app.appliedDateText}</span>
                      </p>

                      {/* Meta Row: location, job type, experience */}
                      <div className="flex flex-wrap items-center gap-3.5 mt-2 text-[12px] text-[#6B7694]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#6B7694]" />
                          <span>{app.location}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-[#6B7694]" />
                          <span>{app.jobType}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#6B7694]" />
                          <span>{app.experience}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status pill, Update text, View Details button & 3-dot menu */}
                  <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2.5 shrink-0">
                    <div className="flex flex-col sm:items-end gap-1">
                      {/* Status Pill: rounded full, 12px, weight 500, padding 4px 14px */}
                      <span
                        className={`inline-block rounded-full text-[12px] font-[500] px-[14px] py-[4px] ${getStatusPillClasses(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                      <span className="text-[11px] text-[#6B7694] flex items-center gap-1 mt-0.5">
                        {app.status === "Interview" ? (
                          <Calendar className="w-3 h-3 text-[#1E5BE0]" />
                        ) : (
                          <Clock className="w-3 h-3 text-[#6B7694]" />
                        )}
                        <span>{app.statusUpdateText}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 sm:mt-2">
                      {/* Outlined blue "View Details →" button */}
                      <button
                        type="button"
                        onClick={() => setSelectedAppForDrawer(app)}
                        className="border-[1.5px] border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white font-[500] text-[13px] px-3.5 py-1.5 rounded-[8px] transition-colors cursor-pointer"
                      >
                        View Details →
                      </button>

                      {/* Vertical Three-dot Menu */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenMenuId(openMenuId === app.id ? null : app.id)}
                          className="p-1.5 text-[#6B7694] hover:text-[#0B1F4B] rounded-lg hover:bg-slate-100 transition"
                          aria-label="Options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openMenuId === app.id && (
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-[#EEF1F7] py-1.5 z-20 text-xs text-[#0B1F4B]">
                            <button
                              type="button"
                              onClick={() => setOpenMenuId(null)}
                              className="w-full text-left px-3.5 py-2 hover:bg-slate-50 cursor-pointer"
                            >
                              Withdraw Application
                            </button>
                            <button
                              type="button"
                              onClick={() => setOpenMenuId(null)}
                              className="w-full text-left px-3.5 py-2 hover:bg-slate-50 cursor-pointer"
                            >
                              Save Job
                            </button>
                            <button
                              type="button"
                              onClick={() => setOpenMenuId(null)}
                              className="w-full text-left px-3.5 py-2 hover:bg-slate-50 cursor-pointer text-[#1E5BE0]"
                            >
                              Contact Recruiter
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom: 5-step Progress Tracker spanning the card width */}
                <div className="pt-4 border-t border-[#EEF1F7]">
                  <div className="relative flex items-center justify-between">
                    {/* Connecting Bar Background */}
                    <div className="absolute top-[12px] left-[12px] right-[12px] h-[2px] bg-[#EEF1F7] -z-0" />

                    {app.steps.map((step, idx) => {
                      const isDone = step.status === "done";
                      const isCurrent = step.status === "current";
                      const isUpcoming = step.status === "upcoming";

                      return (
                        <div key={step.name} className="relative z-10 flex flex-col items-center text-center">
                          {/* 24px Circle */}
                          <div
                            className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                              isDone
                                ? "bg-[#22B573] text-white shadow-2xs"
                                : isCurrent
                                ? "bg-[#1E5BE0] text-white ring-4 ring-[#1E5BE0]/20 shadow-xs"
                                : "bg-[#E3E8F0] text-[#8A93A8]"
                            }`}
                          >
                            {isDone ? (
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            ) : (
                              <span>{step.stepNumber || idx + 1}</span>
                            )}
                          </div>

                          {/* Label below circle */}
                          <span
                            className={`text-[12px] mt-1.5 font-medium truncate max-w-[70px] sm:max-w-none ${
                              isDone || isCurrent ? "text-[#0B1F4B] font-semibold" : "text-[#6B7694]"
                            }`}
                          >
                            {step.name}
                          </span>

                          {/* Date below label where available */}
                          {step.date ? (
                            <span className="text-[11px] text-[#6B7694] mt-0.5">{step.date}</span>
                          ) : (
                            <span className="text-[11px] text-transparent mt-0.5">-</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ================= ZONE 3: RIGHT PANEL (~300px stacked cards, gap 20px) ================= */}
      <aside className="w-full xl:w-[300px] shrink-0 space-y-5">
        {/* 1. Profile Completion Card */}
        <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[16px] font-bold text-[#0B1F4B]">Profile Completion</h3>
            <span className="text-[16px] font-bold text-[#1E5BE0]">
              {data.profileCompletion.percentage}%
            </span>
          </div>
          <p className="text-[12px] text-[#6B7694] mb-3">
            Stand out to employers with a complete resume
          </p>

          {/* Blue progress bar (8px, rounded, light track) */}
          <div className="w-full h-2 bg-[#F1F4F9] rounded-full overflow-hidden mb-5">
            <div
              className="h-full bg-[#1E5BE0] rounded-full transition-all duration-700"
              style={{ width: `${data.profileCompletion.percentage}%` }}
            />
          </div>

          {/* Checklist */}
          <div className="space-y-3 mb-6">
            {data.profileCompletion.checklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-[13px]">
                {item.done ? (
                  <div className="w-5 h-5 rounded-full bg-[#22B573] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                )}
                <span className={`font-medium ${item.done ? "text-[#0B1F4B]" : "text-[#6B7694]"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Full-width solid ORANGE button "Complete Your Profile →" (10px radius, 48px height) */}
          <Link
            href="/student/profile"
            className="w-full h-[48px] bg-[#FF6B00] hover:bg-[#e66000] text-white text-[14px] font-[600] rounded-[10px] flex items-center justify-center transition-all shadow-sm hover:shadow-[#FF6B00]/30 hover:shadow-md"
          >
            Complete Your Profile →
          </Link>
        </div>

        {/* 2. Application Statistics (Vertical Bar Chart with Recharts) */}
        <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-bold text-[#0B1F4B]">Application Statistics</h3>
            <select
              value={statsPeriod}
              onChange={(e) => setStatsPeriod(e.target.value)}
              className="bg-[#F1F4F9] text-[11px] font-medium text-[#0B1F4B] rounded-md px-2 py-1 border-none focus:outline-none cursor-pointer"
            >
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="Last 3 Months">Last 3 Months</option>
            </select>
          </div>

          {/* Bar Chart with value labels above each bar, light-to-strong blue gradient */}
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyStats} margin={{ top: 20, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="appStatsLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A9CCFF" />
                    <stop offset="100%" stopColor="#4D8FFF" />
                  </linearGradient>
                  <linearGradient id="appStatsBold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2F7BFF" />
                    <stop offset="100%" stopColor="#1E5BE0" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={{ stroke: "#EEF1F7" }}
                  tickLine={false}
                  tick={{ fill: "#6B7694", fontSize: 11 }}
                />
                <YAxis
                  domain={[0, 15]}
                  ticks={[0, 5, 10, 15]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7694", fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(30, 91, 224, 0.05)" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#0B1F4B] text-white text-[11px] py-1 px-2 rounded-md shadow-md">
                          <span className="font-bold">{payload[0].value}</span> applications
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[5, 5, 0, 0]}
                  label={{
                    position: "top",
                    fill: "#0B1F4B",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {data.monthlyStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === data.monthlyStats.length - 1 ? "url(#appStatsBold)" : "url(#appStatsLight)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Top Companies Applied Card */}
        <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-bold text-[#0B1F4B]">Top Companies Applied</h3>
            <Link href="/student/jobs" className="text-[13px] font-semibold text-[#1E5BE0] hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-[#EEF1F7]">
            {data.topCompaniesApplied.map((comp) => (
              <div
                key={comp.id}
                className="py-3 flex items-center justify-between group cursor-pointer hover:bg-slate-50/60 rounded-lg px-1 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-[48px] h-[48px] rounded-xl flex items-center justify-center font-bold text-xs border border-[#EEF1F7] bg-white p-1 shrink-0 overflow-hidden shadow-sm ${
                      comp.logoColor || "bg-[#F7F9FD] text-[#0B1F4B]"
                    }`}
                  >
                    {comp.companyLogo && !failedImages[`tc-${comp.id}`] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={comp.companyLogo}
                        alt={comp.name}
                        className="w-full h-full object-contain p-0.5"
                        onError={() => {
                          setFailedImages((prev) => ({ ...prev, [`tc-${comp.id}`]: true }));
                        }}
                      />
                    ) : (
                      <span className="font-bold text-xs text-[#1E5BE0]">{comp.initials || comp.name.slice(0, 3).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-[13px] text-[#0B1F4B] group-hover:text-[#1E5BE0] transition-colors">
                      {comp.name}
                    </h4>
                    <p className="text-[12px] text-[#6B7694]">{comp.countText}</p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-[#FF6B00] group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>
        </div>

        {/* 4. Helpful Tips Card */}
        <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF6EE] text-[#FF6B00] flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-[18px] font-bold text-[#0B1F4B]">Helpful Tips</h3>
          </div>

          {/* Inner Light-Grey Box */}
          <div className="bg-[#F7F9FD] rounded-xl p-4 border border-[#EEF1F7] space-y-3">
            <p className="text-[14px] text-[#6B7694] leading-relaxed">
              Keep your profile updated to get more views from recruiters.
            </p>
            <div className="text-right">
              <Link
                href="/student/profile"
                className="text-[13px] font-semibold text-[#1E5BE0] hover:underline inline-flex items-center gap-1"
              >
                <span>Update Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Slide-over Detail Drawer / Modal for Application Details */}
      {selectedAppForDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-300">
          <div
            className="w-full max-w-lg h-full bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-[#EEF1F7]"
            role="dialog"
            aria-modal="true"
          >
            <div className="space-y-6">
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#EEF1F7]">
                <div className="flex items-center gap-3">
                  <div className="w-[52px] h-[52px] rounded-xl border border-[#EEF1F7] p-1.5 flex items-center justify-center font-bold text-xs bg-white shrink-0 overflow-hidden shadow-xs">
                    {selectedAppForDrawer.companyLogo && !failedImages[`dr-${selectedAppForDrawer.id}`] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={selectedAppForDrawer.companyLogo}
                        alt={selectedAppForDrawer.companyName}
                        className="w-full h-full object-contain p-0.5"
                        onError={() => {
                          setFailedImages((prev) => ({ ...prev, [`dr-${selectedAppForDrawer.id}`]: true }));
                        }}
                      />
                    ) : (
                      <span className="font-bold text-xs text-[#1E5BE0]">{selectedAppForDrawer.companyInitials || selectedAppForDrawer.companyName.slice(0, 3).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] text-[#0B1F4B] leading-tight">
                      {selectedAppForDrawer.title}
                    </h3>
                    <p className="text-[13px] text-[#6B7694] mt-0.5">{selectedAppForDrawer.companyName}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedAppForDrawer(null)}
                  className="w-9 h-9 rounded-full bg-[#F1F4F9] hover:bg-slate-200 text-[#6B7694] hover:text-[#0B1F4B] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Application Meta */}
              <div className="bg-[#F7F9FD] rounded-xl p-4 border border-[#EEF1F7] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6B7694] font-medium">Application Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusPillClasses(selectedAppForDrawer.status)}`}>
                    {selectedAppForDrawer.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6B7694] font-medium">Applied Date</span>
                  <span className="text-xs font-bold text-[#0B1F4B]">{selectedAppForDrawer.appliedDateText}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6B7694] font-medium">Work Location</span>
                  <span className="text-xs font-semibold text-[#0B1F4B]">{selectedAppForDrawer.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6B7694] font-medium">Job Category</span>
                  <span className="text-xs font-semibold text-[#0B1F4B]">{selectedAppForDrawer.jobType} • {selectedAppForDrawer.experience}</span>
                </div>
              </div>

              {/* Full Timeline Steps */}
              <div>
                <h4 className="font-bold text-[15px] text-[#0B1F4B] mb-4">Hiring Timeline & Stages</h4>
                <div className="space-y-4 relative pl-3 before:absolute before:left-[17px] before:top-3 before:bottom-3 before:w-[2px] before:bg-[#EEF1F7]">
                  {selectedAppForDrawer.steps.map((st, i) => {
                    const isDone = st.status === "done";
                    const isCurrent = st.status === "current";
                    return (
                      <div key={st.name} className="flex items-start gap-3.5 relative z-10">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                            isDone
                              ? "bg-[#22B573] text-white"
                              : isCurrent
                              ? "bg-[#1E5BE0] text-white ring-4 ring-[#1E5BE0]/20"
                              : "bg-[#E3E8F0] text-[#8A93A8]"
                          }`}
                        >
                          {isDone ? <Check className="w-4 h-4 stroke-[2.5]" /> : i + 1}
                        </div>
                        <div className="flex-1 bg-white p-3 rounded-xl border border-[#EEF1F7] shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className={`text-[13px] font-bold ${isCurrent ? "text-[#1E5BE0]" : isDone ? "text-[#0B1F4B]" : "text-[#6B7694]"}`}>
                              {st.name}
                            </span>
                            {st.date && <span className="text-[11px] text-[#6B7694]">{st.date}</span>}
                          </div>
                          <p className="text-[12px] text-[#6B7694] mt-0.5">
                            {isDone
                              ? "Completed successfully by hiring panel"
                              : isCurrent
                              ? "Currently in evaluation with recruitment leads"
                              : "Pending stage progression"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#EEF1F7] flex items-center gap-3 mt-6">
              <Link
                href={`/student/jobs/${selectedAppForDrawer.jobId}`}
                className="flex-1 h-11 bg-[#1E5BE0] hover:bg-[#1548b8] text-white font-semibold text-sm rounded-[10px] flex items-center justify-center transition-colors"
              >
                View Job Description
              </Link>
              <button
                type="button"
                onClick={() => setSelectedAppForDrawer(null)}
                className="px-4 h-11 border border-[#EEF1F7] hover:bg-slate-50 text-[#0B1F4B] font-semibold text-sm rounded-[10px] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
