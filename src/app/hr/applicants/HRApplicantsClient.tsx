"use client";

import React, { useState, useEffect } from "react";
import { Application } from "@/types";
import { formatDate, getNameInitials, getAvatarUrl } from "@/lib/utils";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  X,
  UserCheck,
  Eye,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  ChevronDown,
  Clock,
  Sparkles,
  Download,
  AlertCircle,
  Video,
  FileText,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationsService } from "@/services/applications.service";
import { hrService } from "@/services/hr.service";
import { buildIsoInterviewTime } from "@/lib/utils";
import Portal from "@/components/common/Portal";

const STATUS_TABS = [
  { label: "All Applicants", key: "All" },
  { label: "Under Review", key: "Under Review" },
  { label: "Shortlisted", key: "Shortlisted" },
  { label: "Interview", key: "Interview" },
  { label: "Selected", key: "Selected" },
  { label: "Rejected", key: "Rejected" },
];

export function normalizeApplicantStatus(status?: string): "Under Review" | "Shortlisted" | "Interview" | "Selected" | "Rejected" {
  const s = (status || "").trim().toUpperCase();
  switch (s) {
    case "SHORTLISTED":
      return "Shortlisted";
    case "INTERVIEW":
    case "INTERVIEWING":
    case "SCHEDULED":
      return "Interview";
    case "SELECTED":
    case "OFFERED":
    case "HIRED":
    case "ACCEPTED":
      return "Selected";
    case "REJECTED":
    case "WITHDRAWN":
    case "DECLINED":
      return "Rejected";
    case "UNDER REVIEW":
    case "UNDER_REVIEW":
    case "APPLIED":
    case "SCREENING":
    case "IN_REVIEW":
    default:
      return "Under Review";
  }
}

export default function HRApplicantsClient({ initialApplicants }: { initialApplicants: Application[] }) {
  const queryClient = useQueryClient();

  const { data: applicantsQuery = initialApplicants } = useQuery({
    queryKey: ["hr-applications"],
    queryFn: () => hrService.getApplicants(),
    placeholderData: initialApplicants,
    staleTime: 20_000,
  });

  const { data: interviewsQuery = [] } = useQuery({
    queryKey: ["hr-interviews"],
    queryFn: () => hrService.getInterviews(),
    staleTime: 20_000,
  });

  const { data: myJobs = [] } = useQuery({
    queryKey: ["hr-jobs"],
    queryFn: () => hrService.getMyJobs(),
    staleTime: 30_000,
  });

  const [applicants, setApplicants] = useState<Application[]>(applicantsQuery);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedJobId, setSelectedJobId] = useState<string>("All");

  const [scheduledAppIds, setScheduledAppIds] = useState<Set<string>>(() => {
    return new Set(interviewsQuery.map((i: any) => i.applicationId).filter(Boolean));
  });

  useEffect(() => {
    if (applicantsQuery) setApplicants(applicantsQuery);
  }, [applicantsQuery]);

  useEffect(() => {
    if (Array.isArray(interviewsQuery)) {
      setScheduledAppIds(new Set(interviewsQuery.map((i: any) => i.applicationId).filter(Boolean)));
    }
  }, [interviewsQuery]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlStatus = params.get("status");
      if (urlStatus) {
        const foundTab = STATUS_TABS.find(
          (t) => t.key.toLowerCase() === urlStatus.toLowerCase()
        );
        if (foundTab) {
          setActiveTab(foundTab.key);
        }
      }

      const urlJobId = params.get("jobId") || params.get("job");
      if (urlJobId) {
        setSelectedJobId(urlJobId);
      }
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false);

  // Resume download & preview state
  const [downloadingResumeId, setDownloadingResumeId] = useState<string | null>(null);
  const [previewResume, setPreviewResume] = useState<{
    url: string;
    fileName: string;
    candidateName: string;
  } | null>(null);

  // Candidate detail / Status update modal
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  // Schedule Interview form
  const getTomorrowDate = () => {
    const d = new Date(Date.now() + 86400000);
    return d.toISOString().split("T")[0];
  };

  const [interviewDate, setInterviewDate] = useState(getTomorrowDate);
  const [interviewTime, setInterviewTime] = useState("11:30 AM");
  const [interviewType, setInterviewType] = useState<"Technical" | "HR Discussion" | "Managerial" | "Screening">("Technical");
  const [meetingLink, setMeetingLink] = useState("https://meet.google.com/wegrow-interview");
  const [interviewNotes, setInterviewNotes] = useState("");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (scheduleModalOpen || previewResume) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [scheduleModalOpen, previewResume]);

  const handleDownloadResume = async (app: Application) => {
    const resumeId = app.resumeId;
    const directUrl = app.resumeUrl && app.resumeUrl !== "#" ? app.resumeUrl : null;

    if (!resumeId && !directUrl) {
      showToast("No resume on file for this candidate.", "error");
      return;
    }

    setDownloadingResumeId(app.id);

    // Synchronously open a blank window before async calls to bypass browser popup blockers
    let targetTab: Window | null = null;
    try {
      targetTab = window.open("", "_blank");
      if (targetTab) {
        targetTab.document.write(`
          <!DOCTYPE html>
          <html>
            <head><title>Opening Candidate Resume — WeGrow</title></head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc;">
              <div style="text-align: center; color: #0B1F4B;">
                <div style="width: 38px; height: 38px; border: 3px solid #E3E8F0; border-top-color: #1E5BE0; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
                <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 6px;">Opening Candidate CV...</h3>
                <p style="font-size: 13px; color: #6B7694; margin: 0;">${app.applicantName} • Cloudflare R2</p>
              </div>
              <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
            </body>
          </html>
        `);
      }
    } catch {
      // Browser popup blocked
    }

    try {
      let finalUrl = directUrl;
      let fileName = app.resumeName || `${app.applicantName.replace(/\\s+/g, "_")}_Resume.pdf`;

      if (resumeId) {
        const dl = await hrService.getCandidateResumeDownloadUrl(resumeId);
        if (dl?.downloadUrl) {
          finalUrl = dl.downloadUrl;
          if (dl.fileName) fileName = dl.fileName;
        }
      }

      if (!finalUrl) {
        if (targetTab && !targetTab.closed) targetTab.close();
        showToast("Unable to generate resume download link.", "error");
        return;
      }

      // 1. If tab was successfully created, redirect it to the download URL
      if (targetTab && !targetTab.closed) {
        targetTab.location.href = finalUrl;
      } else {
        // 2. Direct fallback trigger via hidden anchor
        const a = document.createElement("a");
        a.href = finalUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }

      // 3. Also open in-page preview modal for interactive review
      setPreviewResume({
        url: finalUrl,
        fileName,
        candidateName: app.applicantName,
      });

      showToast(`Opened resume for ${app.applicantName}!`, "success");
    } catch (err: any) {
      if (targetTab && !targetTab.closed) targetTab.close();
      const msg = err?.response?.data?.message || err?.message || "Failed to download candidate resume";
      showToast(msg, "error");
    } finally {
      setDownloadingResumeId(null);
    }
  };

  const updateStatus = async (appId: string, newStatus: any) => {
    // 1. Optimistic update
    const prevApplicants = applicants;
    setApplicants((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
    if (selectedApplicant && selectedApplicant.id === appId) {
      setSelectedApplicant((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Candidate status updated to "${newStatus}"!`);

    try {
      await applicationsService.updateApplicationStatus(appId, newStatus);
      queryClient.setQueryData<Application[]>(["hr-applications"], (prev) =>
        (prev ?? []).map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
    } catch {
      setApplicants(prevApplicants);
      showToast(`Failed to update candidate status.`);
    }
  };

  const openScheduleModal = (app: Application) => {
    setSelectedApplicant(app);
    setInterviewDate(getTomorrowDate());
    setMeetingLink("https://meet.google.com/wegrow-interview");
    setInterviewNotes("");
    setScheduleModalOpen(true);
  };

  const handleStatusChange = async (app: Application, newStatus: string) => {
    if (newStatus === "Interview") {
      // If already scheduled, just update status
      if (scheduledAppIds.has(app.id)) {
        await updateStatus(app.id, "Interview");
        return;
      }
      // If not yet scheduled, open the schedule modal immediately!
      openScheduleModal(app);
      return;
    }
    await updateStatus(app.id, newStatus);
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplicant) return;

    try {
      setIsSubmittingSchedule(true);
      const { startIso, endIso } = buildIsoInterviewTime(interviewDate, interviewTime);

      await hrService.scheduleInterview({
        applicationId: selectedApplicant.id,
        candidateName: selectedApplicant.applicantName,
        candidateEmail: selectedApplicant.applicantEmail,
        jobTitle: selectedApplicant.jobTitle,
        date: interviewDate,
        time: interviewTime,
        type: interviewType,
        meetingLink: meetingLink?.trim() || "https://meet.google.com/wegrow-interview",
        notes: interviewNotes,
        scheduledStartAt: startIso,
        scheduledEndAt: endIso,
      });

      setScheduledAppIds((prev) => new Set([...prev, selectedApplicant.id]));
      setApplicants((prev) =>
        prev.map((a) => (a.id === selectedApplicant.id ? { ...a, status: "Interview" } : a))
      );
      try {
        await updateStatus(selectedApplicant.id, "Interview");
      } catch {
        // Status may already be transitioned by backend scheduleInterview
      }
      queryClient.invalidateQueries({ queryKey: ["hr-interviews"] });
      queryClient.invalidateQueries({ queryKey: ["hr-applications"] });
      setScheduleModalOpen(false);
      showToast(`Interview invite scheduled & status updated to "Interview"!`);
    } catch (err: any) {
      showToast(err?.message || "Failed to schedule interview.");
    } finally {
      setIsSubmittingSchedule(false);
    }
  };

  const uniqueJobs = React.useMemo(() => {
    const jobMap = new Map<string, string>();
    if (Array.isArray(myJobs)) {
      myJobs.forEach((j: any) => {
        if (j.id && j.title) jobMap.set(String(j.id), j.title);
      });
    }
    applicants.forEach((a) => {
      if (a.jobId && a.jobTitle) {
        if (!jobMap.has(String(a.jobId))) {
          jobMap.set(String(a.jobId), a.jobTitle);
        }
      }
    });
    return Array.from(jobMap.entries()).map(([id, title]) => ({ id, title }));
  }, [myJobs, applicants]);

  const matchesJob = (app: Application, targetJobId: string) => {
    if (!targetJobId || targetJobId === "All") return true;
    const cleanTarget = String(targetJobId).trim().toLowerCase();
    // 1. Exact jobId match
    if (app.jobId && String(app.jobId).trim().toLowerCase() === cleanTarget) return true;
    // 2. Exact jobTitle match
    if (app.jobTitle && app.jobTitle.trim().toLowerCase() === cleanTarget) return true;
    // 3. Match via myJobs item
    const matchedJob = myJobs.find(
      (j: any) => String(j.id).trim().toLowerCase() === cleanTarget
    );
    if (matchedJob && app.jobTitle && app.jobTitle.trim().toLowerCase() === matchedJob.title.trim().toLowerCase()) {
      return true;
    }
    return false;
  };

  const activeJobTitle = React.useMemo(() => {
    if (selectedJobId === "All") return null;
    const found = uniqueJobs.find((j) => j.id === selectedJobId);
    if (found) return found.title;
    const fromApp = applicants.find((a) => a.jobId === selectedJobId);
    if (fromApp) return fromApp.jobTitle;
    return selectedJobId;
  }, [selectedJobId, uniqueJobs, applicants]);

  // 1. Filter applicants by selected job first
  const jobFilteredApplicants = React.useMemo(() => {
    if (selectedJobId === "All") return applicants;
    return applicants.filter((app) => matchesJob(app, selectedJobId));
  }, [applicants, selectedJobId, myJobs]);

  // 2. Metrics counts reflect the current active job context
  const counts = {
    all: jobFilteredApplicants.length,
    underReview: jobFilteredApplicants.filter((a) => normalizeApplicantStatus(a.status) === "Under Review").length,
    shortlisted: jobFilteredApplicants.filter((a) => normalizeApplicantStatus(a.status) === "Shortlisted").length,
    interview: jobFilteredApplicants.filter((a) => normalizeApplicantStatus(a.status) === "Interview").length,
    selected: jobFilteredApplicants.filter((a) => normalizeApplicantStatus(a.status) === "Selected").length,
    rejected: jobFilteredApplicants.filter((a) => normalizeApplicantStatus(a.status) === "Rejected").length,
  };

  // 3. Final filtered applicants combines job selection, status tab, and search term
  const filteredApplicants = jobFilteredApplicants.filter((app) => {
    const normalized = normalizeApplicantStatus(app.status);
    const matchesTab = activeTab === "All" || normalized.toLowerCase() === activeTab.toLowerCase();
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      app.applicantName.toLowerCase().includes(query) ||
      app.jobTitle.toLowerCase().includes(query) ||
      (app.applicantCollege && app.applicantCollege.toLowerCase().includes(query)) ||
      app.applicantEmail.toLowerCase().includes(query);
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const normalized = normalizeApplicantStatus(status);
    switch (normalized) {
      case "Shortlisted":
        return "bg-[#FFF0E6] text-[#FF6B00] border border-[#FFE0CC]";
      case "Interview":
        return "bg-[#EAF1FF] text-[#1E5BE0] border border-[#D5E3FF]";
      case "Selected":
        return "bg-[#E8F8EF] text-[#22B573] border border-[#C6F0D8]";
      case "Rejected":
        return "bg-rose-50 text-[#EF4444] border border-rose-200";
      default:
        return "bg-[#F1F4F9] text-[#6B7694] border border-[#E3E8F0]";
    }
  };

  const COUNT_METRICS = [
    {
      key: "All",
      label: "Total Applicants",
      count: counts.all,
      sub: "Entire candidate pool",
      icon: Users,
      color: "text-[#1E5BE0]",
      bg: "bg-[#E8F0FF]",
      activeStyle: "border-[#1E5BE0] ring-2 ring-[#1E5BE0]/20 bg-blue-50/50 shadow-sm",
    },
    {
      key: "Under Review",
      label: "Under Review",
      count: counts.underReview,
      sub: "Screening stage",
      icon: Clock,
      color: "text-[#F59E0B]",
      bg: "bg-[#FEF3C7]",
      activeStyle: "border-[#F59E0B] ring-2 ring-[#F59E0B]/20 bg-amber-50/50 shadow-sm",
    },
    {
      key: "Shortlisted",
      label: "Shortlisted",
      count: counts.shortlisted,
      sub: "High match profiles",
      icon: Sparkles,
      color: "text-[#FF6B00]",
      bg: "bg-[#FFF0E6]",
      activeStyle: "border-[#FF6B00] ring-2 ring-[#FF6B00]/20 bg-orange-50/50 shadow-sm",
    },
    {
      key: "Interview",
      label: "Interview",
      count: counts.interview,
      sub: "Live video rounds",
      icon: Video,
      color: "text-[#6366F1]",
      bg: "bg-[#EEF2FF]",
      activeStyle: "border-[#6366F1] ring-2 ring-[#6366F1]/20 bg-indigo-50/50 shadow-sm",
    },
    {
      key: "Selected",
      label: "Selected / Hired",
      count: counts.selected,
      sub: "Job offers issued",
      icon: CheckCircle2,
      color: "text-[#22B573]",
      bg: "bg-[#E8F8EF]",
      activeStyle: "border-[#22B573] ring-2 ring-[#22B573]/20 bg-emerald-50/50 shadow-sm",
    },
    {
      key: "Rejected",
      label: "Rejected",
      count: counts.rejected,
      sub: "Archived & not moving",
      icon: X,
      color: "text-[#EF4444]",
      bg: "bg-rose-50",
      activeStyle: "border-rose-400 ring-2 ring-rose-400/20 bg-rose-50/50 shadow-sm",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto w-full font-['Poppins',sans-serif]">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl border text-xs font-semibold flex items-center gap-2 animate-bounce ${
            toast.type === "success"
              ? "bg-[#0B1F4B] text-white border-blue-400/20"
              : "bg-rose-600 text-white border-rose-300/30"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#22B573]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* 1. Header with Search, Job Filter Dropdown & Quick Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#1E5BE0] text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" /> Candidate Review Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4B] tracking-tight">
            Candidate Pipeline & Screening
          </h1>
          <p className="text-sm text-[#6B7694] mt-1">
            Filter by job opening, search candidates, or click any metric count card to drill into specific stages.
          </p>
        </div>

        {/* Search input & Job selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
          {/* Job Filter Selector */}
          <div className="relative min-w-[210px]">
            <select
              value={selectedJobId}
              onChange={(e) => {
                const newJobId = e.target.value;
                setSelectedJobId(newJobId);
                if (typeof window !== "undefined") {
                  const url = new URL(window.location.href);
                  if (newJobId === "All") {
                    url.searchParams.delete("jobId");
                    url.searchParams.delete("job");
                  } else {
                    url.searchParams.set("jobId", newJobId);
                  }
                  window.history.replaceState({}, "", url.toString());
                }
              }}
              className="w-full bg-white text-xs font-semibold text-[#0B1F4B] pl-3 pr-8 py-2.5 rounded-[10px] border border-[#EEF1F7] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 shadow-xs cursor-pointer appearance-none truncate"
            >
              <option value="All">All Job Openings ({applicants.length})</option>
              {uniqueJobs.map((j) => {
                const jobCount = applicants.filter((a) => matchesJob(a, j.id)).length;
                return (
                  <option key={j.id} value={j.id}>
                    {j.title} ({jobCount})
                  </option>
                );
              })}
            </select>
            <ChevronDown className="w-4 h-4 text-[#6B7694] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Search input */}
          <div className="relative w-full sm:w-64 md:w-72">
            <Search className="w-4 h-4 text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search student, college..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-xs text-[#0B1F4B] placeholder-[#6B7694] pl-10 pr-4 py-2.5 rounded-[10px] border border-[#EEF1F7] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Active Job Filter Indicator Banner */}
      {selectedJobId !== "All" && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-[#E8F0FF] via-blue-50/50 to-white border border-[#CDE0FF] rounded-2xl shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1E5BE0] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Briefcase className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#6B7694] uppercase tracking-wider">Filtered by Job:</span>
                <span className="text-sm font-extrabold text-[#0B1F4B]">
                  {activeJobTitle || "Selected Opening"}
                </span>
              </div>
              <p className="text-[11px] text-[#6B7694]">
                Showing only candidates who applied for this role ({jobFilteredApplicants.length} applicant{jobFilteredApplicants.length === 1 ? "" : "s"})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedJobId("All");
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.delete("jobId");
                url.searchParams.delete("job");
                window.history.replaceState({}, "", url.toString());
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-[#6B7694] hover:text-[#EF4444] border border-[#D5E3FF] hover:border-rose-200 text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
          >
            <X className="w-3.5 h-3.5" />
            <span>Show All Jobs ({applicants.length})</span>
          </button>
        </div>
      )}

      {/* 2. Interactive Applicants Counts Cards Section (Clickable Quick Filter Tiles) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {COUNT_METRICS.map((metric) => {
          const isSelected = activeTab === metric.key;
          const Icon = metric.icon;
          return (
            <button
              type="button"
              key={metric.key}
              onClick={() => setActiveTab(metric.key)}
              className={`text-left p-3 sm:p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer group active:scale-97 ${
                isSelected
                  ? `${metric.activeStyle} -translate-y-0.5`
                  : "bg-white border-[#EEF1F7] hover:border-slate-300 hover:shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-xl ${metric.bg} ${metric.color} flex items-center justify-center transition-transform group-hover:scale-105`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#0B1F4B] text-white">
                    Active
                  </span>
                )}
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#0B1F4B] tracking-tight">
                {metric.count}
              </div>
              <div className="text-xs font-bold text-[#0B1F4B] truncate mt-0.5">
                {metric.label}
              </div>
              <div className="text-[10px] text-[#6B7694] truncate">
                {metric.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Interactive Status Tabs */}
      <div className="bg-white rounded-[14px] border border-[#EEF1F7] p-1.5 shadow-[0_4px_14px_rgba(11,31,75,0.05)] flex items-center gap-2 overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const count =
            tab.key === "All"
              ? jobFilteredApplicants.length
              : jobFilteredApplicants.filter((a) => normalizeApplicantStatus(a.status) === tab.key).length;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-[10px] text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-[#1E5BE0] text-white shadow-sm"
                  : "text-[#6B7694] hover:bg-[#F7F9FD] hover:text-[#0B1F4B]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-[#F1F4F9] text-[#6B7694]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Candidates Pipeline Table with Instant Status Change */}
      <div className="bg-white rounded-[16px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9FD] text-[#6B7694] font-semibold uppercase text-[11px] border-b border-[#EEF1F7]">
              <tr>
                <th className="py-3.5 px-4">Candidate Profile</th>
                <th className="py-3.5 px-4">Applied Role</th>
                <th className="py-3.5 px-4">College / Batch</th>
                <th className="py-3.5 px-4">Applied Date</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4 text-center">Change Status (Click)</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF1F7]">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#6B7694]">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-2xl bg-[#F1F4F9] flex items-center justify-center text-[#6B7694] mb-3">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-sm text-[#0B1F4B]">No candidates found</p>
                      <p className="text-xs mt-1 text-[#6B7694]">
                        {selectedJobId !== "All"
                          ? `No candidates found for "${activeJobTitle}" with status "${activeTab}".`
                          : activeTab !== "All"
                          ? `No candidates currently under "${activeTab}" stage.`
                          : "No candidates match your search filter."}
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                        {activeTab !== "All" && (
                          <button
                            type="button"
                            onClick={() => setActiveTab("All")}
                            className="px-3.5 py-1.5 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] text-xs font-bold hover:bg-[#D5E3FF] transition cursor-pointer"
                          >
                            View All Stages ({jobFilteredApplicants.length})
                          </button>
                        )}
                        {selectedJobId !== "All" && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedJobId("All");
                              if (typeof window !== "undefined") {
                                const url = new URL(window.location.href);
                                url.searchParams.delete("jobId");
                                url.searchParams.delete("job");
                                window.history.replaceState({}, "", url.toString());
                              }
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-white border border-[#D5E3FF] text-[#0B1F4B] text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                          >
                            Show All Jobs ({applicants.length})
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-[#F7F9FD]/60 transition-colors">
                    {/* Candidate */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full shrink-0 shadow-xs overflow-hidden bg-gradient-to-tr from-[#1E5BE0] to-blue-400 flex items-center justify-center">
                          {app.applicantAvatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={app.applicantAvatar}
                              alt={app.applicantName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const fallbackUrl = app.applicantId ? getAvatarUrl(app.applicantId) : "";
                                if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
                                  e.currentTarget.src = fallbackUrl;
                                  return;
                                }
                                const el = e.currentTarget;
                                el.style.display = "none";
                                const parent = el.parentElement;
                                if (parent && !parent.querySelector(".fb-init")) {
                                  const span = document.createElement("span");
                                  span.className = "fb-init text-white font-bold text-sm";
                                  span.textContent = getNameInitials(app.applicantName);
                                  parent.appendChild(span);
                                }
                              }}
                            />
                          ) : (
                            <span className="text-white font-bold text-sm">
                              {getNameInitials(app.applicantName)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#0B1F4B] text-[13px]">{app.applicantName}</p>
                          <div className="flex items-center gap-2 text-[11px] text-[#6B7694] mt-0.5">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-[#1E5BE0]" /> {app.applicantEmail}
                            </span>
                            {app.applicantPhone && (
                              <span className="hidden sm:inline">| {app.applicantPhone}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Job Role */}
                    <td className="py-4 px-4">
                      <span className="font-semibold text-[#0B1F4B] block">{app.jobTitle}</span>
                      <span className="text-[11px] text-[#6B7694]">Campus Opportunity</span>
                    </td>

                    {/* College */}
                    <td className="py-4 px-4">
                      <p className="font-medium text-[#0B1F4B]">{app.applicantCollege || "College not specified"}</p>
                      <p className="text-[11px] text-[#6B7694]">
                        {app.applicantGradYear ? `Batch ${app.applicantGradYear}` : "Candidate"}
                        {app.applicantExperience ? ` • ${app.applicantExperience}` : ""}
                      </p>
                    </td>

                    {/* Applied Date */}
                    <td className="py-4 px-4 text-[#6B7694] font-medium whitespace-nowrap">
                      {formatDate(app.appliedDate || app.appliedAt)}
                    </td>

                    {/* Current Status Pill */}
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(app.status)}`}>
                        {normalizeApplicantStatus(app.status)}
                      </span>
                    </td>

                    {/* Status Dropdown / Fast Switcher */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-block relative">
                        <select
                          value={normalizeApplicantStatus(app.status)}
                          onChange={(e) => handleStatusChange(app, e.target.value)}
                          className="bg-[#F1F4F9] hover:bg-[#E3EEFF] text-[#0B1F4B] text-xs font-semibold px-3 py-1.5 rounded-[8px] border border-[#E3E8F0] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 cursor-pointer transition-colors"
                        >
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Download / View Candidate Resume from Cloudflare R2 */}
                        <button
                          type="button"
                          onClick={() => handleDownloadResume(app)}
                          disabled={downloadingResumeId === app.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F1F4F9] text-[#1E5BE0] hover:bg-[#E3EEFF] active:scale-95 disabled:opacity-60 rounded-[8px] text-xs font-semibold transition cursor-pointer"
                          title="View / Download Candidate CV (Cloudflare R2)"
                        >
                          {downloadingResumeId === app.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1E5BE0]" />
                          ) : (
                            <FileText className="w-3.5 h-3.5" />
                          )}
                          <span>{downloadingResumeId === app.id ? "Opening..." : "CV"}</span>
                        </button>

                        {/* Schedule Button or Scheduled Badge */}
                        {scheduledAppIds.has(app.id) ? (
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#E8F8EF] text-[#22B573] border border-[#C6F0D8] rounded-[8px] text-xs font-semibold shadow-2xs select-none"
                            title="Interview already scheduled"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Scheduled</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openScheduleModal(app)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1E5BE0] text-white hover:bg-[#1546B0] rounded-[8px] text-xs font-semibold transition-colors cursor-pointer"
                            title="Schedule Assessment / Interview"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Schedule</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Reject application for ${app.applicantName}?`)) {
                              updateStatus(app.id, "Rejected");
                            }
                          }}
                          className="p-1.5 rounded-[8px] text-[#6B7694] hover:text-[#EF4444] hover:bg-rose-50 transition cursor-pointer"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Native APK Candidate Cards View */}
        <div className="md:hidden divide-y divide-[#EEF1F7] p-3 space-y-3">
          {filteredApplicants.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#6B7694]">
              <div className="w-10 h-10 rounded-xl bg-[#F1F4F9] flex items-center justify-center text-[#6B7694] mx-auto mb-2">
                <Users className="w-5 h-5" />
              </div>
              <p className="font-bold text-[#0B1F4B]">No candidates found</p>
              <p className="text-[11px] mt-0.5 text-[#6B7694]">
                {selectedJobId !== "All"
                  ? `No candidates in "${activeJobTitle}" for "${activeTab}".`
                  : activeTab !== "All"
                  ? `No applicants in "${activeTab}" stage.`
                  : "No applicants match search filter."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2.5">
                {activeTab !== "All" && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("All")}
                    className="px-3 py-1 rounded-lg bg-[#E8F0FF] text-[#1E5BE0] text-xs font-bold"
                  >
                    View All Stages ({jobFilteredApplicants.length})
                  </button>
                )}
                {selectedJobId !== "All" && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJobId("All");
                      if (typeof window !== "undefined") {
                        const url = new URL(window.location.href);
                        url.searchParams.delete("jobId");
                        url.searchParams.delete("job");
                        window.history.replaceState({}, "", url.toString());
                      }
                    }}
                    className="px-3 py-1 rounded-lg bg-white border border-[#D5E3FF] text-[#0B1F4B] text-xs font-bold"
                  >
                    Show All Jobs ({applicants.length})
                  </button>
                )}
              </div>
            </div>
          ) : (
            filteredApplicants.map((app) => (
              <div
                key={app.id}
                className="bg-[#F8FAFC] border border-[#E9EFF6] rounded-2xl p-4 space-y-3 shadow-2xs"
              >
                {/* Header: Candidate Info & Status Dropdown */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-full shrink-0 shadow-xs overflow-hidden bg-gradient-to-tr from-[#1E5BE0] to-blue-400 flex items-center justify-center">
                      {app.applicantAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={app.applicantAvatar}
                          alt={app.applicantName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const fallbackUrl = app.applicantId ? getAvatarUrl(app.applicantId) : "";
                            if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
                              e.currentTarget.src = fallbackUrl;
                              return;
                            }
                            const el = e.currentTarget;
                            el.style.display = "none";
                            const parent = el.parentElement;
                            if (parent && !parent.querySelector(".fb-init")) {
                              const span = document.createElement("span");
                              span.className = "fb-init text-white font-bold text-sm";
                              span.textContent = getNameInitials(app.applicantName);
                              parent.appendChild(span);
                            }
                          }}
                        />
                      ) : (
                        <span className="text-white font-bold text-sm">
                          {getNameInitials(app.applicantName)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#0B1F4B] text-sm truncate">{app.applicantName}</p>
                      <p className="text-[11px] text-[#6B7694] truncate">{app.applicantEmail}</p>
                    </div>
                  </div>

                  <select
                    value={normalizeApplicantStatus(app.status)}
                    onChange={(e) => handleStatusChange(app, e.target.value)}
                    className="bg-white text-[#0B1F4B] text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-[#D8E2EE] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 shadow-2xs shrink-0"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* Candidate Quick Meta */}
                <div className="bg-white rounded-xl p-2.5 border border-[#EEF1F7] text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7694] text-[11px]">Applied Role:</span>
                    <span className="font-semibold text-[#0B1F4B] text-right truncate max-w-[200px]">
                      {app.jobTitle}
                    </span>
                  </div>
                  {app.applicantCollege && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#6B7694] text-[11px]">College:</span>
                      <span className="text-[#3E4A62] text-[11px] font-medium text-right truncate max-w-[190px]">
                        {app.applicantCollege}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-0.5 text-[11px] text-[#6B7694]">
                    <span>Applied: {formatDate(app.appliedDate || app.appliedAt)}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold ${getStatusBadge(app.status)}`}>
                      {normalizeApplicantStatus(app.status)}
                    </span>
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex items-center gap-2 pt-0.5">
                  {/* CV Download / View */}
                  <button
                    type="button"
                    onClick={() => handleDownloadResume(app)}
                    disabled={downloadingResumeId === app.id}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-[#D8E2EE] text-[#1E5BE0] active:bg-[#F1F4F9] disabled:opacity-60 rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
                  >
                    {downloadingResumeId === app.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1E5BE0]" />
                    ) : (
                      <FileText className="w-3.5 h-3.5" />
                    )}
                    <span>{downloadingResumeId === app.id ? "Opening..." : "View CV"}</span>
                  </button>

                  {/* Schedule or Scheduled */}
                  {scheduledAppIds.has(app.id) ? (
                    <span className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-[#E8F8EF] text-[#22B573] border border-[#C6F0D8] rounded-xl text-xs font-semibold select-none">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Scheduled</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openScheduleModal(app)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-[#1E5BE0] active:scale-[0.98] text-white rounded-xl text-xs font-semibold shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Schedule</span>
                    </button>
                  )}

                  {/* Reject button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Reject application for ${app.applicantName}?`)) {
                        updateStatus(app.id, "Rejected");
                      }
                    }}
                    className="inline-flex items-center justify-center p-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl active:bg-rose-100"
                    title="Reject Candidate"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. MODAL: SCHEDULE INTERVIEW & SET STATUS TO "INTERVIEW"       */}
      {/* ============================================================== */}
      {scheduleModalOpen && selectedApplicant && (
        <Portal>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#EEF1F7] space-y-5">
            <div className="flex items-center justify-between border-b border-[#EEF1F7] pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5BE0] bg-[#E8F0FF] px-2.5 py-0.5 rounded-full mb-1">
                  <Video className="w-3.5 h-3.5" />
                  Live Interview Setup
                </div>
                <h3 className="text-lg font-bold text-[#0B1F4B]">
                  Schedule Interview Round
                </h3>
                <p className="text-xs text-[#6B7694]">
                  Candidate: <strong className="text-[#0B1F4B]">{selectedApplicant.applicantName}</strong> • {selectedApplicant.jobTitle}
                </p>
              </div>
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="p-1.5 rounded-lg text-[#6B7694] hover:bg-[#F1F4F9] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                    Interview Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] px-3 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                    Interview Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    placeholder="e.g. 11:30 AM"
                    className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] px-3 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                    Interview Type *
                  </label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value as any)}
                    className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] px-3 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                  >
                    <option value="Technical">Technical Round</option>
                    <option value="HR Discussion">HR Discussion</option>
                    <option value="Managerial">Managerial Round</option>
                    <option value="Screening">Screening Assessment</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                    Google Meet / Video Link *
                  </label>
                  <input
                    type="url"
                    required
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] px-3 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                  Internal Notes & Evaluation Criteria
                </label>
                <textarea
                  rows={3}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  placeholder="Focus on data structures, system design, and prior internship experience..."
                  className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] px-3 py-2 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#EEF1F7] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-[8px] font-semibold text-[#6B7694] hover:bg-[#F1F4F9] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSchedule}
                  className="px-5 py-2.5 rounded-[8px] font-bold bg-[#1E5BE0] hover:bg-[#1546B0] text-white shadow-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  {isSubmittingSchedule && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isSubmittingSchedule ? "Scheduling..." : "Confirm & Move to Interview Round"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        </Portal>
      )}

      {/* ============================================================== */}
      {/* 5. MODAL: CANDIDATE RESUME / CV PREVIEW DIALOG                 */}
      {/* ============================================================== */}
      {previewResume && (
        <Portal>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] max-w-4xl w-full h-[88vh] flex flex-col shadow-2xl border border-[#EEF1F7] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#EEF1F7] px-5 sm:px-6 py-4 bg-[#F8FAFC]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-[#0B1F4B] flex items-center gap-2 truncate">
                    <span>{previewResume.candidateName}’s Resume</span>
                    <span className="text-[10px] sm:text-[11px] font-semibold bg-[#E8F8EF] text-[#22B573] border border-[#C6F0D8] px-2 py-0.5 rounded-full shrink-0">
                      Verified
                    </span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#6B7694] truncate">
                    {previewResume.fileName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewResume.url}
                  download={previewResume.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1E5BE0] hover:bg-[#1546B0] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  title="Download Resume PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </a>
                <a
                  href={previewResume.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F1F4F9] hover:bg-[#E3EEFF] text-[#1E5BE0] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  title="Open in new window"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Tab</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewResume(null)}
                  className="p-2 rounded-xl text-[#6B7694] hover:bg-[#F1F4F9] hover:text-[#0B1F4B] transition-colors cursor-pointer"
                  title="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Embedded PDF Viewer */}
            <div className="flex-1 bg-neutral-100 p-2 sm:p-4 overflow-hidden relative flex flex-col">
              <iframe
                src={`${previewResume.url}#toolbar=1&navpanes=0`}
                className="w-full flex-1 rounded-xl border border-neutral-200 bg-white"
                title={`${previewResume.candidateName} Resume`}
              />
              <div className="text-center pt-2 text-[11px] text-[#6B7694]">
                PDF preview not rendering in your browser?{" "}
                <a
                  href={previewResume.url}
                  download={previewResume.fileName}
                  className="text-[#1E5BE0] font-semibold underline underline-offset-2 hover:text-[#1546B0]"
                >
                  Click here to download directly
                </a>
              </div>
            </div>
          </div>
        </div>
        </Portal>
      )}
    </div>
  );
}
