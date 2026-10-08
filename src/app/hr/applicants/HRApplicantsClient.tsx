"use client";

import React, { useState, useEffect } from "react";
import { Application } from "@/types";
import { formatDate, getNameInitials } from "@/lib/utils";
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
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationsService } from "@/services/applications.service";
import { hrService } from "@/services/hr.service";

const STATUS_TABS = [
  { label: "All Applicants", key: "All" },
  { label: "Under Review", key: "Under Review" },
  { label: "Shortlisted", key: "Shortlisted" },
  { label: "Interview", key: "Interview" },
  { label: "Selected", key: "Selected" },
  { label: "Rejected", key: "Rejected" },
];

export default function HRApplicantsClient({ initialApplicants }: { initialApplicants: Application[] }) {
  const queryClient = useQueryClient();

  const { data: applicantsQuery = initialApplicants } = useQuery({
    queryKey: ["hr-applications"],
    queryFn: () => hrService.getApplicants(),
    initialData: initialApplicants.length > 0 ? initialApplicants : undefined,
    staleTime: 20_000,
  });

  const { data: interviewsQuery = [] } = useQuery({
    queryKey: ["hr-interviews"],
    queryFn: () => hrService.getInterviews(),
    staleTime: 20_000,
  });

  const [applicants, setApplicants] = useState<Application[]>(applicantsQuery);
  const [activeTab, setActiveTab] = useState("All");

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

  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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

      await hrService.scheduleInterview({
        applicationId: selectedApplicant.id,
        candidateName: selectedApplicant.applicantName,
        candidateEmail: selectedApplicant.applicantEmail,
        jobTitle: selectedApplicant.jobTitle,
        date: interviewDate,
        time: interviewTime,
        type: interviewType,
        meetingLink,
        notes: interviewNotes,
        scheduledStartAt: startIso,
        scheduledEndAt: endIso,
      });

      setScheduledAppIds((prev) => new Set([...prev, selectedApplicant.id]));
      await updateStatus(selectedApplicant.id, "Interview");
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

  // Filter logic
  const filteredApplicants = applicants.filter((app) => {
    const matchesTab = activeTab === "All" || app.status.toLowerCase() === activeTab.toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      app.applicantName.toLowerCase().includes(query) ||
      app.jobTitle.toLowerCase().includes(query) ||
      (app.applicantCollege && app.applicantCollege.toLowerCase().includes(query)) ||
      app.applicantEmail.toLowerCase().includes(query);
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
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

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto w-full font-['Poppins',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1F4B] text-white px-5 py-3 rounded-xl shadow-xl border border-blue-400/20 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#22B573]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header with Search & Quick Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#1E5BE0] text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" /> Candidate Review Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4B] tracking-tight">
            Candidate Pipeline & Screening
          </h1>
          <p className="text-sm text-[#6B7694] mt-1">
            Change statuses directly (Under Review, Shortlisted, Interview, Selected, Rejected) and schedule interviews.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by student, role, college..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white text-xs text-[#0B1F4B] placeholder-[#6B7694] pl-10 pr-4 py-2.5 rounded-[10px] border border-[#EEF1F7] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 shadow-xs"
          />
        </div>
      </div>

      {/* 2. Interactive Status Tabs */}
      <div className="bg-white rounded-[14px] border border-[#EEF1F7] p-1.5 shadow-[0_4px_14px_rgba(11,31,75,0.05)] flex items-center gap-2 overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const count =
            tab.key === "All"
              ? applicants.length
              : applicants.filter((a) => a.status.toLowerCase() === tab.key.toLowerCase()).length;
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
        <div className="overflow-x-auto">
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
                  <td colSpan={7} className="py-10 text-center text-[#6B7694]">
                    No candidates found for this status tab or search filter.
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
                                const fallbackUrl = app.applicantId
                                  ? `${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://wegrow-jobportal-backend.vercel.app/api/v1"}/media/avatar/${app.applicantId}`
                                  : "";
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
                    <td className="py-4 px-4 text-[#6B7694]">
                      {formatDate(app.appliedDate)}
                    </td>

                    {/* Current Status Pill */}
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>

                    {/* Status Dropdown / Fast Switcher */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-block relative">
                        <select
                          value={app.status}
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
                          onClick={async () => {
                            if (app.resumeId) {
                              try {
                                const dl = await hrService.getCandidateResumeDownloadUrl(app.resumeId);
                                if (dl?.downloadUrl) {
                                  window.open(dl.downloadUrl, "_blank", "noopener,noreferrer");
                                  return;
                                }
                              } catch (err: any) {
                                showToast(err.response?.data?.message || "Failed to download candidate resume");
                                return;
                              }
                            }
                            if (app.resumeUrl) {
                              window.open(app.resumeUrl, "_blank", "noopener,noreferrer");
                            } else {
                              showToast("No resume on file for this candidate.");
                            }
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#F1F4F9] text-[#1E5BE0] hover:bg-[#E3EEFF] rounded-[8px] text-xs font-semibold transition cursor-pointer"
                          title="Download Candidate CV (Cloudflare R2)"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">CV</span>
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
      </div>

      {/* ============================================================== */}
      {/* 4. MODAL: SCHEDULE INTERVIEW & SET STATUS TO "INTERVIEW"       */}
      {/* ============================================================== */}
      {scheduleModalOpen && selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F4B]/60 backdrop-blur-xs animate-in fade-in duration-200">
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
      )}
    </div>
  );
}
