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
import { getNameInitials } from "@/lib/utils";

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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

  const copyMeetingLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    showToast("Meeting link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Mark Interview Complete
  const handleMarkComplete = async (interviewId: string) => {
    try {
      const ok = await hrService.completeInterview(interviewId, "Candidate evaluation completed");
      if (ok) {
        setInterviews((prev) =>
          prev.map((i) => (i.id === interviewId ? { ...i, status: "Completed" } : i))
        );
        queryClient.setQueryData<Interview[]>(["hr-interviews"], (prev) =>
          (prev ?? []).map((i) => (i.id === interviewId ? { ...i, status: "Completed" } : i))
        );
        queryClient.invalidateQueries({ queryKey: ["hr-interviews"] });
        showToast("Interview marked as completed!");
      }
    } catch {
      showToast("Failed to update interview status.");
    }
  };

  // Cancel Interview
  const handleCancelInterview = async (interviewId: string) => {
    if (!confirm("Are you sure you want to cancel this interview session?")) return;
    try {
      const ok = await hrService.cancelInterview(interviewId, "Cancelled by recruiter");
      if (ok) {
        setInterviews((prev) =>
          prev.map((i) => (i.id === interviewId ? { ...i, status: "Cancelled" } : i))
        );
        queryClient.setQueryData<Interview[]>(["hr-interviews"], (prev) =>
          (prev ?? []).map((i) => (i.id === interviewId ? { ...i, status: "Cancelled" } : i))
        );
        queryClient.invalidateQueries({ queryKey: ["hr-interviews"] });
        showToast("Interview session cancelled.");
      }
    } catch {
      showToast("Failed to cancel interview.");
    }
  };

  // Handle Schedule Modal Submission
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let startIso = new Date(Date.now() + 86400000).toISOString();
      let endIso = new Date(Date.now() + 86400000 + 3600000).toISOString();
      if (interviewDate) {
        let hours = 11, minutes = 30;
        const match = interviewTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (match) {
          hours = parseInt(match[1], 10);
          minutes = parseInt(match[2], 10);
          const meridiem = match[3]?.toUpperCase();
          if (meridiem === "PM" && hours < 12) hours += 12;
          if (meridiem === "AM" && hours === 12) hours = 0;
        }
        const d = new Date(interviewDate);
        d.setHours(hours, minutes, 0, 0);
        startIso = d.toISOString();
        endIso = new Date(d.getTime() + 60 * 60 * 1000).toISOString();
      }

      const created = await hrService.scheduleInterview({
        applicationId: selectedAppId,
        candidateName: customCandidateName,
        candidateEmail: customCandidateEmail,
        jobTitle: customJobTitle || "Software Trainee",
        date: interviewDate,
        time: interviewTime,
        type: interviewType,
        meetingLink,
        notes: interviewNotes,
        scheduledStartAt: startIso,
        scheduledEndAt: endIso,
      });

      setInterviews((prev) => [created, ...prev]);
      queryClient.invalidateQueries({ queryKey: ["hr-interviews"] });
      queryClient.invalidateQueries({ queryKey: ["hr-applications"] });
      setIsScheduleModalOpen(false);
      showToast(`Interview scheduled successfully for ${customCandidateName || "Candidate"}!`);
    } catch (err: any) {
      showToast(err?.message || "Failed to schedule interview.");
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

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/hr/applicants"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 border border-[#E3E8F0] hover:bg-white text-[#0B1F4B] text-xs font-semibold rounded-[10px] transition-colors shadow-2xs"
          >
            <User className="w-3.5 h-3.5 text-[#1E5BE0]" />
            <span>View Applicants</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsScheduleModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1E5BE0] hover:bg-[#1546B0] text-white text-xs font-bold rounded-[10px] transition-colors shadow-sm cursor-pointer"
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
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1E5BE0] to-blue-400 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                    {interview.candidateAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={interview.candidateAvatar}
                        alt={interview.candidateName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
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
                      onClick={() => handleCancelInterview(interview.id)}
                      className="p-2 border border-[#E3E8F0] hover:bg-rose-50 hover:text-[#EF4444] hover:border-rose-200 rounded-[10px] text-[#6B7694] transition cursor-pointer"
                      title="Cancel Session"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F4B]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#EEF1F7] space-y-5">
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
                  <input
                    type="text"
                    required
                    placeholder="Candidate Name"
                    value={customCandidateName}
                    onChange={(e) => setCustomCandidateName(e.target.value)}
                    className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] px-3 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                  />
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
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-[8px] font-bold bg-[#1E5BE0] hover:bg-[#1546B0] text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm & Send Invite</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
