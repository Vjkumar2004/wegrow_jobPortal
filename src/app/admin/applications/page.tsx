"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { MOCK_APPLICATIONS } from "@/constants/mockData";
import { formatDate } from "@/lib/utils";
import {
  FileCheck,
  Search,
  Building2,
  Calendar,
  User,
  ExternalLink,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function AdminApplicationsPage() {
  const [applications] = useState(MOCK_APPLICATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-7 space-y-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-[14px] p-6 sm:p-7 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] bg-gradient-to-r from-[#FFF5EE] via-[#F4F8FF] to-[#E9F2FF] flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0756A8] text-xs font-bold uppercase tracking-wider mb-2">
              <FileCheck className="w-3.5 h-3.5" /> Platform Application Tracker
            </div>
            <h1 className="text-[22px] sm:text-[26px] font-bold text-[#0B1F4B] tracking-tight">
              Applications & Campus Submissions
            </h1>
            <p className="text-[13px] text-[#6B7694] mt-1">
              Global log of all candidate submissions, recruiter review stages, shortlisted profiles, and hiring rounds.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[#EEF1F7] shadow-sm shrink-0">
            <div className="text-center px-3">
              <div className="text-lg font-bold text-[#0B1F4B] leading-none">
                {applications.length}
              </div>
              <div className="text-[11px] text-[#6B7694] mt-1">Logged Submissions</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-200" />
            <div className="text-center px-3">
              <div className="text-lg font-bold text-[#22B573] leading-none">
                {applications.filter((a) => a.status === "Shortlisted").length}
              </div>
              <div className="text-[11px] text-[#6B7694] mt-1">Shortlisted</div>
            </div>
          </div>
        </div>

        {/* Search & Status Filter */}
        <div className="bg-white rounded-[14px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search candidate, company, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F7FB] text-xs text-[#0B1F4B] placeholder-[#6B7694] pl-9 pr-3 py-2 rounded-xl border border-transparent focus:border-[#1E5BE0] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#F5F7FB] text-xs text-[#0B1F4B] px-3 py-2 rounded-xl border-none focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Application Statuses</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <span className="text-xs text-[#6B7694] font-medium">
            Showing <strong className="text-[#0B1F4B]">{filtered.length}</strong> applications
          </span>
        </div>

        {/* Formatted Table */}
        <div className="bg-white rounded-[14px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F7FB] text-[12px] font-semibold text-[#6B7694] h-[48px]">
                  <th className="px-5 py-3 rounded-l-lg">Applicant Candidate</th>
                  <th className="px-5 py-3">Applied Job Role</th>
                  <th className="px-5 py-3">Hiring Enterprise</th>
                  <th className="px-5 py-3">Submission Date</th>
                  <th className="px-5 py-3 text-center rounded-r-lg">Application Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1F7] text-[13px]">
                {filtered.map((app) => {
                  const initials = app.applicantName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2);

                  const isReview = app.status === "Under Review" || app.status === "Applied";
                  const isShortlisted = app.status === "Shortlisted";
                  const isInterview = app.status === "Interview";
                  const isRejected = app.status === "Rejected";

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Candidate */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1E5BE0] to-blue-400 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-[#0B1F4B] text-sm leading-snug">
                              {app.applicantName}
                            </p>
                            <p className="text-[11px] text-[#6B7694] mt-0.5">{app.applicantEmail}</p>
                          </div>
                        </div>
                      </td>

                      {/* Job Role */}
                      <td className="px-5 py-4 font-semibold text-[#0B1F4B]">
                        {app.jobTitle}
                      </td>

                      {/* Company */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-blue-50 text-[#0756A8] text-[10px] font-bold flex items-center justify-center">
                            {app.companyName.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-700">{app.companyName}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-[#6B7694]">
                        {formatDate(app.appliedDate)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                            isShortlisted
                              ? "bg-[#D8F3E5] text-[#22B573]"
                              : isInterview
                              ? "bg-[#FFE9D6] text-[#E8650A]"
                              : isRejected
                              ? "bg-[#FFE0E0] text-[#D93636]"
                              : "bg-[#DCEBFF] text-[#1E5BE0]"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
