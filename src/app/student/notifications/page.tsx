"use client";

import React, { useState } from "react";
import { Bell, Check, Calendar, Briefcase, Award, CheckCircle2, Clock, Sparkles } from "lucide-react";

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: "n-1",
      title: "Your application is shortlisted",
      subtitle: "Zoho - Software Engineer",
      time: "2 hours ago",
      type: "green",
      read: false,
      desc: "Congratulations! The hiring manager has shortlisted your application for Frontend Developer."
    },
    {
      id: "n-2",
      title: "Interview scheduled",
      subtitle: "TCS - Software Engineer",
      time: "1 day ago",
      type: "blue",
      read: false,
      desc: "Your technical interview round has been set for Sep 25 at 10:00 AM IST via Google Meet."
    },
    {
      id: "n-3",
      title: "New job matches available",
      subtitle: "10 new jobs match your profile",
      time: "2 days ago",
      type: "orange",
      read: true,
      desc: "10 new opportunities in Frontend and Cloud Engineering were posted this week."
    },
    {
      id: "n-4",
      title: "Your application is under review",
      subtitle: "Infosys - React Developer",
      time: "3 days ago",
      type: "purple",
      read: true,
      desc: "Your application has been received and screening is currently in progress."
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getIconTile = (type: string) => {
    switch (type) {
      case "green":
        return <div className="w-9 h-9 rounded-full bg-[#E8F8F1] text-[#22B573] flex items-center justify-center shrink-0"><CheckCircle2 className="w-5 h-5" /></div>;
      case "blue":
        return <div className="w-9 h-9 rounded-full bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0"><Calendar className="w-5 h-5" /></div>;
      case "orange":
        return <div className="w-9 h-9 rounded-full bg-[#FFF0E6] text-[#FF6B00] flex items-center justify-center shrink-0"><Sparkles className="w-5 h-5" /></div>;
      case "purple":
        return <div className="w-9 h-9 rounded-full bg-[#F3EEFF] text-[#8B5CF6] flex items-center justify-center shrink-0"><Clock className="w-5 h-5" /></div>;
      default:
        return <div className="w-9 h-9 rounded-full bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0"><Bell className="w-5 h-5" /></div>;
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
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`p-4 sm:p-5 rounded-[14px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-start gap-4 ${
              item.read ? "bg-white border-[#EEF1F7]" : "bg-[#F7F9FD] border-[#1E5BE0]/30 shadow-xs"
            }`}
          >
            {getIconTile(item.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-[#0B1F4B] text-[14px] leading-snug">{item.title}</h4>
                <span className="text-[11px] text-[#6B7694] shrink-0 font-medium">{item.time}</span>
              </div>
              <p className="text-xs font-semibold text-[#1E5BE0] mt-0.5">{item.subtitle}</p>
              <p className="text-xs text-[#6B7694] mt-1.5 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
