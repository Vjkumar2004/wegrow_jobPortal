"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Video,
  User,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building2,
  GraduationCap,
  Mail,
  Copy,
  Plus,
  X,
  AlertCircle,
  MoreVertical,
  Check,
  Ban,
  ArrowRight,
  Briefcase,
  Loader2,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Interview, Application } from "@/types";
import { hrService } from "@/services/hr.service";
import { getNameInitials, resolveMediaUrl, buildIsoInterviewTime } from "@/lib/utils";
import Portal from "@/components/common/Portal";

interface HRInterviewsClientProps {
  initialInterviews: Interview[];
}

export default function HRInterviewsClient({ initialInterviews }: HRInterviewsClientProps) {
  const queryClient = useQueryClient();

  const { data: interviewsQuery = initialInterviews, isLoading } = useQuery({
    queryKey: ["hr-interviews"],
    queryFn: () => hrService.getInterviews(),
    initialData: initialInterviews.length > 0 ? initialInterviews : undefined,
    staleTime: 20_000,
  });

  const { data: applicantsQuery = [] } = useQuery({
    queryKey: ["hr-applications"],
    queryFn: () => hrService.getApplicants(),
    staleTime: 20_000,
  });

  const [interviews, setInterviews] = useState<Interview[]>(interviewsQuery);
  const [applicantsList, setApplicantsList] = useState<Application[]>(applicantsQuery);
  const [activeTab, setActiveTab] = useState<"All" | "Upcoming" | "Completed" | "Cancelled">("All");
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState("");
  const [customJobTitle, setCustomJobTitle] = useState("");
  const [customCandidateName, setCustomCandidateName] = useState("");
  const [customCandidateEmail, setCustomCandidateEmail] = useState("");
  const [interviewDate, setInterviewDate] = useState(() => {
    const d = new Date(Date.now() + 86400000);
    return d.toISOString().split("T")[0];
  });
  const [interviewTime, setInterviewTime] = useState("11:30 AM");
  const [interviewType, setInterviewType] = useState<"Technical" | "HR Discussion" | "Managerial" | "Screening">("Technical");
  const [meetingLink, setMeetingLink] = useState("https://meet.google.com/wegrow-interview");
  const [interviewNotes, setInterviewNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cancel Interview Modal State
  const [cancelModalInterview, setCancelModalInterview] = useState<Interview | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (isScheduleModalOpen || cancelModalInterview) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isScheduleModalOpen, cancelModalInterview]);

  useEffect(() => {
    if (interviewsQuery) setInterviews(interviewsQuery);
  }, [interviewsQuery]);

  useEffect(() => {
    if (applicantsQuery && applicantsQuery.length > 0) {
      setApplicantsList(applicantsQuery);
      if (!selectedAppId) {
        setSelectedAppId(applicantsQuery[0].id);
        setCustomJobTitle(applicantsQuery[0].jobTitle);
        setCustomCandidateName(applicantsQuery[0].applicantName);
        setCustomCandidateEmail(applicantsQuery[0].applicantEmail);
      }
    }
  }, [applicantsQuery, selectedAppId]);

  const handleOpenScheduleModal = () => {
    if (applicantsList.length > 0) {
      const selected = applicantsList.find((a) => a.id === selectedAppId) || applicantsList[0];
      setSelectedAppId(selected.id);
      setCustomJobTitle(selected.jobTitle);
      setCustomCandidateName(selected.applicantName);
      setCustomCandidateEmail(selected.applicantEmail);
    }
    const d = new Date(Date.now() + 86400000);
    setInterviewDate(d.toISOString().split("T")[0]);
    setInterviewTime("11:30 AM");
    if (!meetingLink) {
      setMeetingLink("https://meet.google.com/wegrow-interview");
    }
    setIsScheduleModalOpen(true);
  };

  const copyMeetingLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    showToast("Meeting link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Mark Interview Complete
  const handleMarkComplete = async (interviewId: string) => {
    try {
      const res = await hrService.completeInterview(interviewId, "Candidate evaluation completed");
      if (res.success) {
        setInterviews((prev) =>
          prev.map((i) => (i.id === interviewId ? { ...i, status: "Completed" } : i))
        );
        queryClient.setQueryData<Interview[]>(["hr-interviews"], (prev) =>
          (prev ?? []).map((i) => (i.id === interviewId ? { ...i, status: "Completed" } : i))
        );
        queryClient.invalidateQueries({ queryKey: ["hr-interviews"] });
        queryClient.invalidateQueries({ queryKey: ["hr-dashboard"] });
        queryClient.invalidateQueries({ queryKey: ["hr-applications"] });
        showToast("✓ Interview marked as completed!");
      } else {
        showToast(res.message || "Failed to mark interview as completed. Please try again.");
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to update interview status.");
    }
  };

  // Confirm Cancel Interview with Reason
  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalInterview) return;

    const trimmedReason = cancelReason.trim();
    if (!trimmedReason) {
      showToast("Please provide or select a cancellation reason.");
      return;
    }

    setIsCancelling(true);
    try {
      const ok = await hrService.cancelInterview(cancelModalInterview.id, trimmedReason);
      if (ok) {
        setInterviews((prev) =>
          prev.map((i) => (i.id === cancelModalInterview.id ? { ...i, status: "Cancelled", notes: trimmedReason } : i))
        );
        queryClient.setQueryData<Interview[]>(["hr-interviews"], (prev) =>
          (prev ?? []).map((i) => (i.id === cancelModalInterview.id ? { ...i, status: "Cancelled", notes: trimmedReason } : i))
        );
        queryClient.invalidateQueries({ queryKey: ["hr-interviews"] });
        showToast(`Interview cancelled. Notification and email sent to ${cancelModalInterview.candidateName}.`);
        setCancelModalInterview(null);
        setCancelReason("");
      } else {
        showToast("Failed to cancel interview session. Please try again.");
      }
    } catch {
      showToast("Failed to cancel interview.");
    } finally {
      setIsCancelling(false);
    }
  };

  // Handle Schedule Modal Submission
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAppId) {
      showToast("Please select an applicant before scheduling an interview.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { startIso, endIso } = buildIsoInterviewTime(interviewDate, interviewTime);
      const selectedApp = applicantsList.find((a) => a.id === selectedAppId);
      const candidateName = customCandidateName || selectedApp?.applicantName || "Candidate";
      const candidateEmail = customCandidateEmail || selectedApp?.applicantEmail || "";
      const jobTitle = customJobTitle || selectedApp?.jobTitle || "Software Trainee";

      const created = await hrService.scheduleInterview({
        applicationId: selectedAppId,
        candidateName,
        candidateEmail,
        candidateCollege: selectedApp?.applicantCollege,
        candidateAvatar: selectedApp?.applicantAvatar,
        jobTitle,
        date: interviewDate,
        time: interviewTime,
        type: interviewType,
        meetingLink: meetingLink?.trim() || "https://meet.google.com/wegrow-interview",
        notes: interviewNotes,
        scheduledStartAt: startIso,
        scheduledEndAt: endIso,
      });

      if (selectedApp?.applicantAvatar && !created.candidateAvatar) {
        created.candidateAvatar = selectedApp.applicantAvatar;
      }

      setInterviews((prev) => [created, ...prev]);
      queryClient.invalidateQueries({ queryKey: ["hr-interviews"] });
      queryClient.invalidateQueries({ queryKey: ["hr-applications"] });
      setIsScheduleModalOpen(false);
      showToast(`Interview scheduled successfully for ${candidateName}!`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to schedule interview.";
      showToast(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Metrics computation (100% Real)
  const upcomingCount = useMemo(() => interviews.filter((i) => i.status === "Upcoming").length, [interviews]);
  const completedCount = useMemo(() => interviews.filter((i) => i.status === "Completed").length, [interviews]);
  const cancelledCount = useMemo(() => interviews.filter((i) => i.status === "Cancelled").length, [interviews]);
  const uniqueCandidatesCount = useMemo(() => {
    return new Set(interviews.map((i) => i.candidateEmail || i.candidateName)).size;
  }, [interviews]);

  // Filtered Interviews
  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      // Tab filter
      if (activeTab !== "All" && item.status !== activeTab) {
        return false;
      }
      // Format filter
      if (filterType !== "All" && item.type !== filterType) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.candidateName?.toLowerCase().includes(q);
        const matchesRole = item.jobTitle?.toLowerCase().includes(q);
        const matchesEmail = item.candidateEmail?.toLowerCase().includes(q);
        const matchesCollege = item.candidateCollege?.toLowerCase().includes(q);
        return matchesName || matchesRole || matchesEmail || matchesCollege;
      }
      return true;
    });
  }, [interviews, activeTab, filterType, searchQuery]);

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto w-full font-['Poppins',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1F4B] text-white px-5 py-3 rounded-xl shadow-xl border border-blue-400/20 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#22B573]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header with Stats & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#1E5BE0] text-xs font-bold uppercase tracking-wider mb-2">
            <Video className="w-3.5 h-3.5" /> Corporate Placement Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4B] tracking-tight">
            Scheduled Interviews & Video Rounds
          </h1>
          <p className="text-sm text-[#6B7694] mt-1">
            Conduct live Google Meet rounds, monitor panel assessments, and manage campus evaluation records.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
          <Link
            href="/hr/applicants"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2.5 border border-[#E3E8F0] hover:bg-white text-[#0B1F4B] text-xs font-semibold rounded-xl transition-colors shadow-2xs"
          >
            <User className="w-3.5 h-3.5 text-[#1E5BE0]" />
            <span>Applicants</span>
          </Link>

          <button
            type="button"
            onClick={handleOpenScheduleModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-[#1E5BE0] hover:bg-[#1546B0] text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Interview</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Metrics Row (100% Real Dynamic Counts) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Rounds */}
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-md transition">
          <div className="flex items-center justify-between text-[#6B7694]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Rounds</span>
            <div className="w-8 h-8 rounded-lg bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4B] mt-2">
            {interviews.length}
          </div>
          <span className="text-[11px] text-[#1E5BE0] font-semibold mt-1 block">Campus Drive 2026</span>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-md transition">
          <div className="flex items-center justify-between text-[#6B7694]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Upcoming Meets</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF2E8] text-[#FF6B00] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#FF6B00] mt-2">
            {upcomingCount}
          </div>
          <span className="text-[11px] text-[#FF6B00] font-semibold mt-1 block">
            {upcomingCount > 0 ? "Awaiting panel evaluation" : "No pending sessions"}
          </span>
        </div>

        {/* Completed Rounds */}
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-md transition">
          <div className="flex items-center justify-between text-[#6B7694]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
            <div className="w-8 h-8 rounded-lg bg-[#E8F8EF] text-[#22B573] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#22B573] mt-2">
            {completedCount}
          </div>
          <span className="text-[11px] text-[#22B573] font-semibold mt-1 block">
            {completedCount > 0 ? `${completedCount} sessions wrapped` : "No rounds completed yet"}
          </span>
        </div>

        {/* Active Candidates */}
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-md transition">
          <div className="flex items-center justify-between text-[#6B7694]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Candidate Reach</span>
            <div className="w-8 h-8 rounded-lg bg-[#F3EEFF] text-[#8B5CF6] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#8B5CF6] mt-2">
            {uniqueCandidatesCount}
          </div>
          <span className="text-[11px] text-[#8B5CF6] font-semibold mt-1 block">
            {uniqueCandidatesCount === 1 ? "1 student assessed" : `${uniqueCandidatesCount} students assessed`}
          </span>
        </div>
      </div>

      {/* 3. Filter & Search Controls Bar */}
      <div className="bg-white rounded-[14px] p-4 border border-[#EEF1F7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(["All", "Upcoming", "Completed", "Cancelled"] as const).map((tab) => {
            const count =
              tab === "All"
                ? interviews.length
                : tab === "Upcoming"
                ? upcomingCount
                : tab === "Completed"
                ? completedCount
                : cancelledCount;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-[#1E5BE0] text-white shadow-xs"
                    : "text-[#6B7694] hover:bg-[#F1F4F9] hover:text-[#0B1F4B]"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    isActive ? "bg-white/20 text-white" : "bg-[#EEF1F7] text-[#6B7694]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Format Picker */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7694]" />
            <input
              type="text"
              placeholder="Search candidate, role, college..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs pl-8 pr-3 py-2 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs font-semibold px-3 py-2 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 cursor-pointer shrink-0"
          >
            <option value="All">All Formats</option>
            <option value="Technical">Technical Rounds</option>
            <option value="HR Discussion">HR Discussions</option>
            <option value="Managerial">Managerial Rounds</option>
            <option value="Screening">Screening Tests</option>
          </select>
        </div>
      </div>

      {/* 4. Structured Interview Cards Grid */}
      {isLoading ? (
        <div className="bg-white rounded-[16px] border border-[#EEF1F7] p-12 text-center flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#1E5BE0]" />
          <p className="text-xs font-semibold text-[#6B7694]">Loading campus interview schedule...</p>
        </div>
      ) : filteredInterviews.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-[16px] border border-[#EEF1F7] p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center">
            <Video className="w-8 h-8" />
          </div>
          <div className="max-w-md">
            <h3 className="text-base font-bold text-[#0B1F4B]">No Scheduled Interviews Found</h3>
            <p className="text-xs text-[#6B7694] mt-1">
              {searchQuery || filterType !== "All" || activeTab !== "All"
                ? "No interviews match your selected status, format, or search query."
                : "You have not scheduled any candidate video assessments yet. Shortlist applicants and set up technical interviews."}
            </p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1E5BE0] hover:bg-[#1546B0] text-white text-xs font-bold rounded-[8px] transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule First Interview</span>
            </button>
            <Link
              href="/hr/applicants"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#E3E8F0] hover:bg-[#F1F4F9] text-[#0B1F4B] text-xs font-semibold rounded-[8px] transition"
            >
              <span>Go to Applicants</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#1E5BE0]" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredInterviews.map((interview) => (
            <div
              key={interview.id}
              className="bg-white rounded-[16px] border border-[#EEF1F7] p-5 sm:p-6 shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:shadow-md flex flex-col justify-between space-y-4 relative"
            >
              {/* Header: Candidate Details & Format Badges */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1E5BE0] to-blue-400 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-2xs overflow-hidden relative">
                    {interview.candidateAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveMediaUrl(interview.candidateAvatar)}
                        alt={interview.candidateName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const el = e.currentTarget;
                          el.style.display = "none";
                          const parent = el.parentElement;
                          if (parent && !parent.querySelector(".fallback-initials")) {
                            const span = document.createElement("span");
                            span.className = "fallback-initials text-white font-bold text-base select-none";
                            span.textContent = getNameInitials(interview.candidateName || "Candidate");
                            parent.appendChild(span);
                          }
                        }}
                      />
                    ) : (
                      <span>{getNameInitials(interview.candidateName || "Candidate")}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-[#0B1F4B] leading-snug truncate" title={interview.candidateName}>
                      {interview.candidateName}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1E5BE0] bg-[#E8F0FF] px-2 py-0.5 rounded-md truncate">
                        <Briefcase className="w-3 h-3 shrink-0" />
                        <span className="truncate">{interview.jobTitle}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      interview.type === "Technical"
                        ? "bg-[#E8F0FF] text-[#1E5BE0]"
                        : interview.type === "HR Discussion"
                        ? "bg-[#FFF0E6] text-[#FF6B00]"
                        : interview.type === "Managerial"
                        ? "bg-[#F3EEFF] text-[#8B5CF6]"
                        : "bg-[#E8F8EF] text-[#22B573]"
                    }`}
                  >
                    {interview.type}
                  </span>

                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                      interview.status === "Completed"
                        ? "bg-[#E8F8EF] text-[#22B573]"
                        : interview.status === "Cancelled"
                        ? "bg-rose-50 text-[#EF4444]"
                        : "bg-blue-50 text-[#1E5BE0]"
                    }`}
                  >
                    {interview.status === "Upcoming" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1E5BE0] animate-pulse" />
                    )}
                    <span>{interview.status}</span>
                  </span>
                </div>
              </div>

              {/* Time, Date, Details Capsule */}
              <div className="bg-[#F7F9FD] rounded-xl p-3.5 border border-[#EEF1F7] space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2 text-[#0B1F4B]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white text-[#1E5BE0] flex items-center justify-center shrink-0 border border-[#EEF1F7]">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-[#6B7694] uppercase block">Date</span>
                      <strong className="text-[12px]">{interview.date}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white text-[#FF6B00] flex items-center justify-center shrink-0 border border-[#EEF1F7]">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-[#6B7694] uppercase block">Time Slot</span>
                      <strong className="text-[12px]">{interview.time}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EEF1F7] space-y-1.5 text-[11px] text-[#6B7694]">
                  {interview.candidateCollege && (
                    <div className="flex items-center gap-2 truncate">
                      <GraduationCap className="w-3.5 h-3.5 text-[#1E5BE0] shrink-0" />
                      <span className="text-[#0B1F4B] font-medium truncate">{interview.candidateCollege}</span>
                    </div>
                  )}

                  {interview.candidateEmail && (
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-[#6B7694] shrink-0" />
                      <span className="truncate">{interview.candidateEmail}</span>
                    </div>
                  )}
                </div>

                {interview.notes && (
                  <div className="text-[11px] text-[#6B7694] bg-white p-2.5 rounded-lg border border-[#EEF1F7] mt-1.5">
                    <strong className="text-[#0B1F4B]">Evaluation Focus:</strong> {interview.notes}
                  </div>
                )}
              </div>

              {/* Bottom Actions Row */}
              <div className="pt-2 border-t border-[#EEF1F7] flex items-center justify-between gap-2.5">
                {interview.meetingLink ? (
                  <div className="flex items-center gap-2 flex-1">
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1E5BE0] hover:bg-[#1546B0] text-white text-xs font-bold py-2.5 px-3.5 rounded-[10px] transition-colors shadow-2xs"
                    >
                      <Video className="w-4 h-4" />
                      <span>Launch Video Room</span>
                      <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                    </a>

                    <button
                      type="button"
                      onClick={() => copyMeetingLink(interview.meetingLink!, interview.id)}
                      className="px-3 py-2.5 border border-[#E3E8F0] hover:bg-[#F1F4F9] rounded-[10px] text-xs font-semibold text-[#0B1F4B] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                      title="Copy Google Meet Link"
                    >
                      {copiedId === interview.id ? (
                        <CheckCircle2 className="w-4 h-4 text-[#22B573]" />
                      ) : (
                        <Copy className="w-4 h-4 text-[#6B7694]" />
                      )}
                      <span>{copiedId === interview.id ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-[#6B7694]">Link pending generation</span>
                )}

                {/* Status action menu for upcoming interviews */}
                {interview.status === "Upcoming" && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMarkComplete(interview.id)}
                      className="p-2 border border-[#E3E8F0] hover:bg-[#E8F8EF] hover:text-[#22B573] hover:border-[#C6F0D8] rounded-[10px] text-[#6B7694] transition cursor-pointer"
                      title="Mark as Completed"
                    >
                      <Check className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCancelModalInterview(interview);
                        setCancelReason("");
                      }}
                      className="p-2 border border-[#E3E8F0] hover:bg-rose-50 hover:text-[#EF4444] hover:border-rose-200 rounded-[10px] text-[#6B7694] transition cursor-pointer"
                      title="Cancel Session & Notify Candidate"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Schedule Interview Modal */}
      {isScheduleModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-[#EEF1F7] space-y-5">
            <div className="flex items-center justify-between border-b border-[#EEF1F7] pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5BE0] bg-[#E8F0FF] px-2.5 py-0.5 rounded-full mb-1">
                  <Video className="w-3.5 h-3.5" />
                  Live Interview Setup
                </div>
                <h3 className="text-lg font-bold text-[#0B1F4B]">
                  Schedule Assessment Round
                </h3>
                <p className="text-xs text-[#6B7694]">
                  Assign an applicant, set video slot, and generate an official invite.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1.5 rounded-lg text-[#6B7694] hover:bg-[#F1F4F9] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              {/* Candidate Selection */}
              <div>
                <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                  Select Applicant *
                </label>
                {applicantsList.length > 0 ? (
                  <select
                    value={selectedAppId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedAppId(id);
                      const found = applicantsList.find((a) => a.id === id);
                      if (found) {
                        setCustomJobTitle(found.jobTitle);
                        setCustomCandidateName(found.applicantName);
                        setCustomCandidateEmail(found.applicantEmail);
                      }
                    }}
                    className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] px-3 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 font-medium"
                  >
                    {applicantsList.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.applicantName} • {app.jobTitle} ({app.applicantCollege || "Campus"})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-amber-800">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>No Applicants Available Yet</span>
                    </div>
                    <p className="text-[11px] text-amber-700 leading-relaxed">
                      Candidates must first submit an application to one of your active job postings before you can schedule an interview.
                    </p>
                    <Link href="/hr/jobs" className="text-xs font-bold text-[#1E5BE0] hover:underline inline-flex items-center gap-1 mt-1">
                      <span>View My Posted Jobs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Date & Time Picker */}
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

              {/* Format & Meeting Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                    Interview Format *
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

              {/* Notes */}
              <div>
                <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                  Internal Panel Notes & Evaluation Criteria
                </label>
                <textarea
                  rows={3}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  placeholder="Focus on core algorithms, database queries, and problem-solving..."
                  className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] px-3 py-2 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#EEF1F7] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-[8px] font-semibold text-[#6B7694] hover:bg-[#F1F4F9] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedAppId || applicantsList.length === 0}
                  className="px-5 py-2.5 rounded-[8px] font-bold bg-[#1E5BE0] hover:bg-[#1546B0] text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm & Send Invite</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        </Portal>
      )}

      {/* 6. Cancel Interview Reason Pop-Up Modal */}
      {cancelModalInterview && (
        <Portal>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-rose-100 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EEF1F7] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#EF4444] border border-rose-100 flex items-center justify-center shrink-0">
                  <Ban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0B1F4B]">Cancel Interview Session</h3>
                  <p className="text-xs text-[#6B7694]">Provide a reason to notify the student via email & in-app alert.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isCancelling) setCancelModalInterview(null);
                }}
                className="w-8 h-8 rounded-lg text-[#6B7694] hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Candidate & Round Summary Card */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#EEF1F7] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#6B7694]">Candidate:</span>
                <span className="font-bold text-[#0B1F4B]">{cancelModalInterview.candidateName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7694]">Position / Role:</span>
                <span className="font-semibold text-[#1E5BE0]">{cancelModalInterview.jobTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7694]">Interview Round:</span>
                <span className="font-semibold text-[#0B1F4B]">{cancelModalInterview.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7694]">Scheduled Date & Time:</span>
                <span className="font-semibold text-[#0B1F4B]">
                  {cancelModalInterview.date} at {cancelModalInterview.time}
                </span>
              </div>
              {cancelModalInterview.candidateEmail && (
                <div className="flex justify-between border-t border-[#EEF1F7] pt-2 mt-2">
                  <span className="text-[#6B7694] flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#1E5BE0]" /> Student Email:
                  </span>
                  <span className="font-medium text-[#0B1F4B] truncate max-w-[240px]">
                    {cancelModalInterview.candidateEmail}
                  </span>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmCancel} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0B1F4B] mb-1.5">
                  Cancellation Reason <span className="text-rose-500">*</span>
                </label>

                {/* Quick Select Reason Chips */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {[
                    "Interviewer is unavailable; rescheduling soon",
                    "Candidate requested rescheduling",
                    "Position filled / internal placement",
                    "Schedule conflict with panel",
                    "Role requirements updated",
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setCancelReason(chip)}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                        cancelReason === chip
                          ? "bg-rose-50 border-rose-300 text-rose-700 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <textarea
                  required
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter or select a clear reason for cancellation. This will be sent directly to the candidate's email..."
                  className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] text-xs px-3.5 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-300 resize-none"
                />
              </div>

              {/* Informational Email Banner */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-2 text-[11px] text-amber-900 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  An automated email with your cancellation reason will be delivered to <strong>{cancelModalInterview.candidateName}</strong>, and their student portal status will update to <strong>Cancelled</strong>.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#EEF1F7] flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isCancelling}
                  onClick={() => setCancelModalInterview(null)}
                  className="px-4 py-2.5 rounded-[10px] text-xs font-semibold text-[#6B7694] hover:bg-[#F1F4F9] transition cursor-pointer disabled:opacity-50"
                >
                  Keep Interview
                </button>
                <button
                  type="submit"
                  disabled={isCancelling || !cancelReason.trim()}
                  className="px-5 py-2.5 rounded-[10px] text-xs font-bold bg-[#EF4444] hover:bg-rose-700 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Email & Cancelling...</span>
                    </>
                  ) : (
                    <>
                      <Ban className="w-3.5 h-3.5" />
                      <span>Confirm Cancellation & Send Email</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        </Portal>
      )}
    </div>
  );
}
