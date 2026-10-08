"use client";

import React, { useState, useEffect } from "react";
import { Bell, Check, Calendar, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { studentService } from "@/services/student.service";
import { StudentNotificationItem } from "@/types";
import { getCompanyLogoProxyUrl } from "@/lib/utils";

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<StudentNotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    studentService
      .getNotifications()
      .then((data) => {
        if (isMounted) {
          if (data && data.length > 0) {
            setNotifications(data);
          } else {
            // Default demo notifications
            setNotifications([
              {
                id: "n-1",
                title: "Application Shortlisted 🎉",
                subtitle: "Zoho • Frontend Developer",
                message: "Congratulations! The hiring manager has shortlisted your application for Frontend Developer.",
                timeAgo: "2 hours ago",
                type: "green",
                companyName: "Zoho",
                read: false,
              },
              {
                id: "n-2",
                title: "Interview Scheduled 📅",
                subtitle: "TCS • Software Engineer",
                message: "Your technical interview round has been set for Sep 25 at 10:00 AM IST via Google Meet.",
                timeAgo: "1 day ago",
                type: "blue",
                companyName: "TCS",
                read: false,
              },
              {
                id: "n-3",
                title: "New Job Match 🚀",
                subtitle: "Freshworks • React Developer",
                message: "New opening in Frontend Engineering posted this week matching your profile.",
                timeAgo: "2 days ago",
                type: "orange",
                companyName: "Freshworks",
                read: true,
              },
              {
                id: "n-4",
                title: "Application Under Review",
                subtitle: "Infosys • React Developer",
                message: "Your application has been received and screening is currently in progress.",
                timeAgo: "3 days ago",
                type: "purple",
                companyName: "Infosys",
                read: true,
              },
            ]);
          }
        }
      })
      .catch(() => {
        // Fallback
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getIconTile = (type: string) => {
    switch (type) {
      case "green":
        return (
          <div className="w-10 h-10 rounded-xl bg-[#E8F8F1] text-[#22B573] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
      case "blue":
        return (
          <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        );
      case "orange":
        return (
          <div className="w-10 h-10 rounded-xl bg-[#FFF0E6] text-[#FF6B00] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        );
      case "purple":
        return (
          <div className="w-10 h-10 rounded-xl bg-[#F3EEFF] text-[#8B5CF6] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
        );
    }
  };

  const getSmallBadge = (type: string) => {
    switch (type) {
      case "green":
        return <span className="w-2.5 h-2.5 rounded-full bg-[#22B573]" />;
      case "blue":
        return <span className="w-2.5 h-2.5 rounded-full bg-[#1E5BE0]" />;
      case "orange":
        return <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />;
      case "purple":
        return <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />;
      default:
        return <span className="w-2.5 h-2.5 rounded-full bg-[#1E5BE0]" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#1E5BE0] text-xs font-bold uppercase tracking-wider mb-2">
            <Bell className="w-3.5 h-3.5" /> Activity Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F4B] tracking-tight">Notifications</h1>
          <p className="text-sm text-[#6B7694] mt-1">Real-time alerts on interviews, status changes, and campus opportunities.</p>
        </div>
        <button
          type="button"
          onClick={markAllRead}
          className="border border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
        >
          <Check className="w-3.5 h-3.5" /> Mark all read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-[#D2DAE8] p-10 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0B1F4B] mb-1">No Notifications Yet</h3>
            <p className="text-xs text-[#6B7694]">
              You will receive real-time notifications when recruiters view your profile, shortlist your applications, or schedule interviews.
            </p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-[14px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-start gap-4 ${
                item.read ? "bg-white border-[#EEF1F7]" : "bg-[#F7F9FD] border-[#1E5BE0]/30 shadow-xs"
              }`}
            >
              {item.companyLogo || item.companyId ? (
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-xl bg-white border border-[#EEF1F7] p-1 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden font-bold text-xs text-[#1E5BE0]">
                    <img
                      src={item.companyLogo || (item.companyId ? getCompanyLogoProxyUrl(item.companyId) : "")}
                      alt={item.companyName || "Company"}
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
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-xs border border-slate-100">
                    {getSmallBadge(item.type)}
                  </div>
                </div>
              ) : item.companyName ? (
                <div className="w-11 h-11 rounded-xl bg-white border border-[#EEF1F7] p-1 flex items-center justify-center shrink-0 font-bold text-xs text-[#1E5BE0] shadow-2xs">
                  {item.companyName.slice(0, 2).toUpperCase()}
                </div>
              ) : (
                getIconTile(item.type)
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-[#0B1F4B] text-[14px] leading-snug">{item.title}</h4>
                  <span className="text-[11px] text-[#6B7694] shrink-0 font-medium">{item.timeAgo}</span>
                </div>
                {item.subtitle && (
                  <p className="text-xs font-semibold text-[#1E5BE0] mt-0.5">{item.subtitle}</p>
                )}
                <p className="text-xs text-[#6B7694] mt-1.5 leading-relaxed">{item.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
