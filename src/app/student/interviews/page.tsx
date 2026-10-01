import React from "react";
import Link from "next/link";
import { studentService } from "@/services/student.service";
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

export const metadata = {
  title: "My Interviews | WeGrow Student",
  description: "Scheduled technical, behavioral, and HR interview rounds with partner employers.",
};

export default async function StudentInterviewsPage() {
  const interviews = await studentService.getInterviews();
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {upcoming.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[14px] border border-[#EEF1F7] p-6 shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:border-[#1E5BE0]/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1E5BE0] font-bold text-sm flex items-center justify-center shrink-0 border border-blue-100">
                      {item.companyName.slice(0, 2).toUpperCase()}
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
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1F4B]">{item.jobTitle}</h3>
                    <p className="text-xs text-[#6B7694]">{item.companyName}</p>
                  </div>
                  <span className="text-[11px] font-semibold bg-[#E8F8F1] text-[#22B573] px-2.5 py-0.5 rounded-full">
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
