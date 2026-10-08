"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Check,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Inbox,
} from "lucide-react";
import { studentService } from "@/services/student.service";
import { StudentNotificationItem } from "@/types";
import { getCompanyLogoProxyUrl } from "@/lib/utils";

const DEMO_NOTIFICATIONS = [
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
];

type FilterTab = "ALL" | "UNREAD" | "INTERVIEW" | "APPLICATION";

export default function StudentNotificationsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

  const { data: fetchedNotifications, isLoading } = useQuery<StudentNotificationItem[]>({
    queryKey: ["student-notifications"],
    queryFn: () => studentService.getNotifications(),
    staleTime: 15_000,
  });

  const [localOverrides, setLocalOverrides] = useState<Record<string, boolean>>({});

  const baseNotifications: StudentNotificationItem[] =
    fetchedNotifications && fetchedNotifications.length > 0
      ? fetchedNotifications
      : (DEMO_NOTIFICATIONS as StudentNotificationItem[]);

  const notifications = baseNotifications.map((n) =>
    localOverrides[n.id] !== undefined ? { ...n, read: localOverrides[n.id] } : n
  );

  const markAllRead = async () => {
    setLocalOverrides((prev) => {
      const next = { ...prev };
      notifications.forEach((n) => { next[n.id] = true; });
      return next;
    });
    try {
      await studentService.markAllNotificationsAsRead();
      queryClient.invalidateQueries({ queryKey: ["student-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["student-unread-notifs"] });
      window.dispatchEvent(new CustomEvent("notificationsUpdated"));
    } catch (e) {
      console.error("Failed to mark all as read:", e);
    }
  };

  const handleNotificationClick = async (item: StudentNotificationItem) => {
    if (!item.read && item.id && !item.id.startsWith("n-")) {
      setLocalOverrides((prev) => ({ ...prev, [item.id]: true }));
      try {
        await studentService.markNotificationAsRead(item.id);
        queryClient.invalidateQueries({ queryKey: ["student-notifications"] });
        queryClient.invalidateQueries({ queryKey: ["student-unread-notifs"] });
        window.dispatchEvent(new CustomEvent("notificationsUpdated"));
      } catch (e) {
        console.error("Failed to mark as read:", e);
      }
    }
    if (item.linkUrl) {
      window.location.href = item.linkUrl;
    }
  };

  const getIconTile = (type: string) => {
    switch (type) {
      case "green":
        return (
          <div className="w-11 h-11 rounded-xl bg-[#E8F8F1] text-[#22B573] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
      case "blue":
        return (
          <div className="w-11 h-11 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        );
      case "orange":
        return (
          <div className="w-11 h-11 rounded-xl bg-[#FFF0E6] text-[#FF6B00] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        );
      case "purple":
        return (
          <div className="w-11 h-11 rounded-xl bg-[#F3EEFF] text-[#8B5CF6] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-11 h-11 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
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

  // Filter items
  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "UNREAD") return !item.read;
    if (activeTab === "INTERVIEW") {
      return (
        item.type === "blue" ||
        item.title?.toLowerCase().includes("interview") ||
        item.message?.toLowerCase().includes("interview")
      );
    }
    if (activeTab === "APPLICATION") {
      return (
        item.type === "green" ||
        item.type === "purple" ||
        item.title?.toLowerCase().includes("application") ||
        item.title?.toLowerCase().includes("shortlist")
      );
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-5xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#1E5BE0] text-xs font-bold uppercase tracking-wider mb-2">
            <Bell className="w-3.5 h-3.5" /> Activity Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F4B] tracking-tight">
            Notifications
          </h1>
          <p className="text-sm text-[#6B7694] mt-1">
            Real-time updates on job applications, interview schedules, and recruiter activity.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="self-start sm:self-auto border border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-4 py-2 rounded-[10px] text-xs font-semibold transition cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <Check className="w-3.5 h-3.5" /> Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#EEF1F7] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("ALL")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "ALL"
              ? "bg-[#1E5BE0] text-white shadow-sm"
              : "bg-white text-[#6B7694] hover:bg-[#F7F9FD] hover:text-[#0B1F4B] border border-[#EEF1F7]"
          }`}
        >
          All ({notifications.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("UNREAD")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "UNREAD"
              ? "bg-[#1E5BE0] text-white shadow-sm"
              : "bg-white text-[#6B7694] hover:bg-[#F7F9FD] hover:text-[#0B1F4B] border border-[#EEF1F7]"
          }`}
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === "UNREAD"
                  ? "bg-white text-[#1E5BE0]"
                  : "bg-[#EF4444] text-white"
              }`}
            >
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("INTERVIEW")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "INTERVIEW"
              ? "bg-[#1E5BE0] text-white shadow-sm"
              : "bg-white text-[#6B7694] hover:bg-[#F7F9FD] hover:text-[#0B1F4B] border border-[#EEF1F7]"
          }`}
        >
          Interviews
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("APPLICATION")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "APPLICATION"
              ? "bg-[#1E5BE0] text-white shadow-sm"
              : "bg-white text-[#6B7694] hover:bg-[#F7F9FD] hover:text-[#0B1F4B] border border-[#EEF1F7]"
          }`}
        >
          Applications
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 rounded-[14px] bg-white border border-[#EEF1F7] animate-pulse flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded-md w-1/3" />
                  <div className="h-3 bg-slate-100 rounded-md w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-[#D2DAE8] p-12 text-center max-w-md mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center mx-auto mb-3">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#0B1F4B] mb-1">
              No Notifications Found
            </h3>
            <p className="text-xs text-[#6B7694]">
              {activeTab === "UNREAD"
                ? "You have caught up with all your notifications!"
                : "Notifications will appear here as soon as there is activity on your profile or applications."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-4 sm:p-5 rounded-[14px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-start gap-4 cursor-pointer relative ${
                item.read
                  ? "bg-white border-[#EEF1F7]"
                  : "bg-[#F7F9FD] border-[#1E5BE0]/30 shadow-sm"
              }`}
            >
              {/* Left Logo / Icon */}
              {item.companyLogo || item.companyId ? (
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-xl bg-white border border-[#EEF1F7] p-1 flex items-center justify-center shrink-0 shadow-sm overflow-hidden font-bold text-xs text-[#1E5BE0]">
                    <img
                      src={
                        item.companyLogo ||
                        (item.companyId
                          ? getCompanyLogoProxyUrl(item.companyId)
                          : "")
                      }
                      alt={item.companyName || "Company"}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        const proxyUrl = item.companyId
                          ? getCompanyLogoProxyUrl(item.companyId)
                          : "";
                        if (proxyUrl && target.src !== proxyUrl) {
                          target.src = proxyUrl;
                          return;
                        }
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector(".logo-fb")) {
                          const fb = document.createElement("span");
                          fb.textContent = (item.companyName || "Co")
                            .slice(0, 2)
                            .toUpperCase();
                          fb.className =
                            "font-bold text-xs text-[#1E5BE0] logo-fb";
                          parent.appendChild(fb);
                        }
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
                    {getSmallBadge(item.type)}
                  </div>
                </div>
              ) : item.companyName ? (
                <div className="w-11 h-11 rounded-xl bg-white border border-[#EEF1F7] p-1 flex items-center justify-center shrink-0 font-bold text-xs text-[#1E5BE0] shadow-sm">
                  {item.companyName.slice(0, 2).toUpperCase()}
                </div>
              ) : (
                getIconTile(item.type)
              )}

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#0B1F4B] text-[14px] leading-snug">
                      {item.title}
                    </h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#1E5BE0] shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-[#6B7694] shrink-0 font-medium">
                    {item.timeAgo}
                  </span>
                </div>

                {item.subtitle && (
                  <p className="text-xs font-semibold text-[#1E5BE0] mt-0.5">
                    {item.subtitle}
                  </p>
                )}
                <p className="text-xs text-[#6B7694] mt-1.5 leading-relaxed">
                  {item.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
