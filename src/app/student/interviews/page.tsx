"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { studentService } from "@/services/student.service";
import { Interview } from "@/types";
import { getCompanyLogoProxyUrl } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Video,
  Building2,
  ExternalLink,
  ChevronRight,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

export default function StudentInterviewsPage() {
  const { data: interviews = [], isLoading } = useQuery({
    queryKey: ["student-interviews"],
    queryFn: () => studentService.getInterviews(),
    staleTime: 20_000,
  });

  const upcoming = interviews.filter((i) => i.status === "Upcoming");
  const completed = interviews.filter((i) => i.status !== "Upcoming");

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#1E5BE0] text-xs font-bold uppercase tracking-wider mb-2">
          <Calendar className="w-3.5 h-3.5" /> Assessment Calendar
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F4B] tracking-tight">
          Interviews & Screenings
        </h1>
        <p className="text-sm text-[#6B7694] mt-1">
          Review upcoming online meetings, prep notes, interview rounds, and past evaluation feedback.
        </p>
      </div>

      {/* Upcoming Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-[#0B1F4B] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22B573] animate-pulse" />
            Upcoming Rounds ({upcoming.length})
          </h2>
          <span className="text-xs text-[#6B7694]">Live interview assessment links</span>
        </div>

        {upcoming.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-[#D2DAE8] p-10 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0B1F4B] mb-1">No Upcoming Interviews Scheduled</h3>
            <p className="text-xs text-[#6B7694]">
              When recruiters review your applications and shortlist you for technical or HR discussions, your interview schedules and meeting links will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {upcoming.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#EEF1F7] p-4 sm:p-6 shadow-2xs hover:border-[#1E5BE0]/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white text-[#1E5BE0] font-bold text-sm flex items-center justify-center shrink-0 border border-[#EEF1F7] p-1 shadow-2xs overflow-hidden">
                        {item.companyLogo || item.companyId ? (
                          <img
                            src={item.companyLogo || (item.companyId ? getCompanyLogoProxyUrl(item.companyId) : "")}
                            alt={item.companyName}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              const proxyUrl = item.companyId ? getCompanyLogoProxyUrl(item.companyId) : "";
                              if (proxyUrl && target.src !== proxyUrl) {
                                target.src = proxyUrl;
                                return;
                              }
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent && !parent.querySelector(".logo-fb")) {
                                const fb = document.createElement("span");
                                fb.textContent = (item.companyName || "Co").slice(0, 2).toUpperCase();
                                fb.className = "font-bold text-xs text-[#1E5BE0] logo-fb";
                                parent.appendChild(fb);
                              }
                            }}
                          />
                        ) : (
                          item.companyName.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-[#0B1F4B] leading-snug">
                          {item.jobTitle}
                        </h3>
                        <p className="text-xs text-[#6B7694] font-medium">{item.companyName}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FFE9D6] text-[#E8650A]">
                      {item.type}
                    </span>
                  </div>

                  {/* Date & Time pill */}
                  <div className="mt-4 p-3 rounded-xl bg-[#F7F9FD] border border-[#EEF1F7] flex items-center justify-between text-xs text-[#0B1F4B]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#1E5BE0]" />
                      <span className="font-semibold">{item.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#6B7694]" />
                      <span>{item.time}</span>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="mt-3 text-xs bg-slate-50 p-3 rounded-xl text-[#6B7694] border border-slate-100 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF6B00] shrink-0 mt-0.5" />
                      <span>Prep: {item.notes}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Join CTA */}
                <div className="pt-4 border-t border-[#EEF1F7] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#22B573] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Link Active
                  </span>
                  {item.meetingLink ? (
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-[#1E5BE0] hover:bg-[#1548b8] text-white text-xs font-semibold px-4 py-2 rounded-[8px] transition-colors shadow-sm"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Meeting</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-[#6B7694]">Link will be emailed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Section */}
      {completed.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-[#EEF1F7]">
          <h2 className="text-base sm:text-lg font-bold text-[#0B1F4B]">
            Past Interview History ({completed.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completed.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[14px] border border-[#EEF1F7] p-5 shadow-sm space-y-3 opacity-90"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#EEF1F7] p-1 flex items-center justify-center shrink-0 font-bold text-xs text-[#1E5BE0] shadow-2xs overflow-hidden">
                      {item.companyLogo || item.companyId ? (
                        <img
                          src={item.companyLogo || (item.companyId ? getCompanyLogoProxyUrl(item.companyId) : "")}
                          alt={item.companyName}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector(".logo-fb")) {
                              const fb = document.createElement("span");
                              fb.textContent = (item.companyName || "Co").slice(0, 2).toUpperCase();
                              fb.className = "font-bold text-xs text-[#1E5BE0] logo-fb";
                              parent.appendChild(fb);
                            }
                          }}
                        />
                      ) : (
                        (item.companyName || "Co").slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#0B1F4B] truncate">{item.jobTitle}</h3>
                      <p className="text-xs text-[#6B7694] truncate">{item.companyName}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold bg-[#E8F8F1] text-[#22B573] px-2.5 py-0.5 rounded-full shrink-0">
                    Completed
                  </span>
                </div>
                <div className="text-xs text-[#6B7694] flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Conducted on {item.date} • {item.type} round</span>
                </div>
                {item.notes && (
                  <p className="text-xs bg-[#F7F9FD] p-2.5 rounded-xl text-[#6B7694] border border-[#EEF1F7]">
                    Feedback: {item.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
