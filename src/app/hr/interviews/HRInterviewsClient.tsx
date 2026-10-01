"use client";

import React, { useState } from "react";
import { Interview } from "@/types";
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
  MapPin,
  Mail,
  Copy,
  Plus,
} from "lucide-react";

interface HRInterviewsClientProps {
  initialInterviews: Interview[];
}

export default function HRInterviewsClient({ initialInterviews }: HRInterviewsClientProps) {
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [filterType, setFilterType] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyMeetingLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filtered = interviews.filter((item) => {
    if (filterType === "All") return true;
    return item.type?.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto w-full font-['Poppins',sans-serif]">
      {/* 1. Header with Stats & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#1E5BE0] text-xs font-bold uppercase tracking-wider mb-2">
            <Video className="w-3.5 h-3.5" /> Live Campus Assessment
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4B] tracking-tight">
            Scheduled Interviews & Video Rounds
          </h1>
          <p className="text-sm text-[#6B7694] mt-1">
            Manage upcoming video meets, technical coding rounds, and interview evaluation panels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-[#E3E8F0] text-[#0B1F4B] text-xs font-semibold px-3 py-2 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 shadow-xs cursor-pointer"
          >
            <option value="All">All Formats</option>
            <option value="Technical">Technical Rounds</option>
            <option value="HR Discussion">HR Discussions</option>
            <option value="Managerial">Managerial Rounds</option>
            <option value="Screening">Screening Tests</option>
          </select>
        </div>
      </div>

      {/* 2. Quick Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)]">
          <span className="text-[11px] font-bold text-[#6B7694] uppercase tracking-wider">Total Rounds</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4B] mt-1.5">{interviews.length}</div>
          <span className="text-xs text-[#1E5BE0] font-semibold mt-1 block">Campus Drive 2026</span>
        </div>
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)]">
          <span className="text-[11px] font-bold text-[#6B7694] uppercase tracking-wider">Today&apos;s Meets</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#FF6B00] mt-1.5">2</div>
          <span className="text-xs text-[#FF6B00] font-semibold mt-1 block">Next at 11:30 AM</span>
        </div>
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)]">
          <span className="text-[11px] font-bold text-[#6B7694] uppercase tracking-wider">Completed</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#22B573] mt-1.5">14</div>
          <span className="text-xs text-[#22B573] font-semibold mt-1 block">Feedback logged</span>
        </div>
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)]">
          <span className="text-[11px] font-bold text-[#6B7694] uppercase tracking-wider">Attendance Rate</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#8B5CF6] mt-1.5">96.8%</div>
          <span className="text-xs text-[#8B5CF6] font-semibold mt-1 block">Verified students</span>
        </div>
      </div>

      {/* 3. Interview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {filtered.map((interview) => (
          <div
            key={interview.id}
            className="bg-white rounded-[16px] border border-[#EEF1F7] p-6 shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between space-y-4"
          >
            {/* Header: Candidate & Type */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1E5BE0] to-blue-400 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                  {interview.candidateName ? interview.candidateName.slice(0, 2).toUpperCase() : "VM"}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1F4B] leading-snug">
                    {interview.candidateName}
                  </h3>
                  <p className="text-xs text-[#6B7694]">{interview.jobTitle}</p>
                </div>
              </div>

              <span
                className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                  interview.type === "Technical"
                    ? "bg-[#E8F0FF] text-[#1E5BE0]"
                    : interview.type === "HR Discussion"
                    ? "bg-[#FFF0E6] text-[#FF6B00]"
                    : "bg-[#E8F8EF] text-[#22B573]"
                }`}
              >
                {interview.type}
              </span>
            </div>

            {/* Time, Date, Details Capsule */}
            <div className="bg-[#F7F9FD] rounded-xl p-3.5 border border-[#EEF1F7] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#0B1F4B] font-semibold">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1E5BE0]" />
                  <span>{interview.date}</span>
                </div>
                <div className="flex items-center gap-2 text-[#6B7694]">
                  <Clock className="w-4 h-4 text-[#FF6B00]" />
                  <span className="font-semibold text-[#0B1F4B]">{interview.time}</span>
                </div>
              </div>

              {interview.candidateEmail && (
                <div className="flex items-center gap-2 text-[#6B7694] pt-1 border-t border-[#EEF1F7]">
                  <Mail className="w-3.5 h-3.5 text-[#6B7694]" />
                  <span>{interview.candidateEmail}</span>
                </div>
              )}

              {interview.notes && (
                <div className="text-[11px] text-[#6B7694] bg-white p-2.5 rounded-lg border border-[#EEF1F7] mt-1">
                  <strong className="text-[#0B1F4B]">Panel Focus:</strong> {interview.notes}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              {interview.meetingLink ? (
                <>
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1E5BE0] hover:bg-[#1546B0] text-white text-xs font-bold py-2.5 px-4 rounded-[10px] transition-colors shadow-sm"
                  >
                    <Video className="w-4 h-4" />
                    <span>Launch Video Room</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                  </a>

                  <button
                    type="button"
                    onClick={() => copyMeetingLink(interview.meetingLink!, interview.id)}
                    className="px-3 py-2.5 border border-[#E3E8F0] hover:bg-[#F1F4F9] rounded-[10px] text-xs font-semibold text-[#0B1F4B] transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Copy Google Meet Link"
                  >
                    {copiedId === interview.id ? (
                      <CheckCircle2 className="w-4 h-4 text-[#22B573]" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#6B7694]" />
                    )}
                    <span>{copiedId === interview.id ? "Copied" : "Copy"}</span>
                  </button>
                </>
              ) : (
                <span className="text-xs text-[#6B7694]">Link pending generation</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
