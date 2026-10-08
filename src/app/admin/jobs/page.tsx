"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/layouts/AdminLayout";
import { adminService } from "@/services/admin.service";
import { Job } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  Briefcase,
  Search,
  Building2,
  MapPin,
  Clock,
  Eye,
  Trash2,
  Check,
  Pause,
  ExternalLink,
  DollarSign,
} from "lucide-react";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    adminService
      .getJobs()
      .then((data) => setJobs(data))
      .catch(() => setJobs([]))
      .finally(() => setIsLoading(false));
  }, []);

  const updateStatus = (id: string, status: any) => {
    setJobs(jobs.map((j) => (j.id === id ? { ...j, status } : j)));
  };

  const removeJob = (id: string) => {
    if (confirm("Permanently remove this job from the campus portal?")) {
      setJobs(jobs.filter((j) => j.id !== id));
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "ALL" || job.jobType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-7 space-y-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-[14px] p-6 sm:p-7 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] bg-gradient-to-r from-[#FFF5EE] via-[#F4F8FF] to-[#E9F2FF] flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0756A8] text-xs font-bold uppercase tracking-wider mb-2">
              <Briefcase className="w-3.5 h-3.5" /> Opportunity Moderation Hub
            </div>
            <h1 className="text-[22px] sm:text-[26px] font-bold text-[#0B1F4B] tracking-tight">
              Jobs & Openings Moderation
            </h1>
            <p className="text-[13px] text-[#6B7694] mt-1">
              Supervise campus postings, verify salary packages and eligibility criteria, approve new listings, or pause active recruitments.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[#EEF1F7] shadow-sm shrink-0">
            <div className="text-center px-3">
              <div className="text-lg font-bold text-[#0B1F4B] leading-none">
                {jobs.length}
              </div>
              <div className="text-[11px] text-[#6B7694] mt-1">Total Openings</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-200" />
            <div className="text-center px-3">
              <div className="text-lg font-bold text-[#22B573] leading-none">
                {jobs.filter((j) => j.status === "Published").length}
              </div>
              <div className="text-[11px] text-[#6B7694] mt-1">Live Published</div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-[14px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search job title, employer, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F7FB] text-xs text-[#0B1F4B] placeholder-[#6B7694] pl-9 pr-3 py-2 rounded-xl border border-transparent focus:border-[#1E5BE0] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#F5F7FB] text-xs text-[#0B1F4B] px-3 py-2 rounded-xl border-none focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Job Types</option>
              <option value="Full Time">Full Time</option>
              <option value="Internship">Internship</option>
              <option value="Part Time">Part Time</option>
            </select>
          </div>

          <span className="text-xs text-[#6B7694] font-medium">
            Showing <strong className="text-[#0B1F4B]">{filteredJobs.length}</strong> active posts
          </span>
        </div>

        {/* Formatted Table */}
        <div className="bg-white rounded-[14px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F7FB] text-[12px] font-semibold text-[#6B7694] h-[48px]">
                  <th className="px-5 py-3 rounded-l-lg">Job Designation</th>
                  <th className="px-5 py-3">Hiring Company</th>
                  <th className="px-5 py-3">Compensation</th>
                  <th className="px-5 py-3">Posted Date</th>
                  <th className="px-5 py-3 text-center">Applicants</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right rounded-r-lg">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1F7] text-[13px]">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-[#6B7694]">
                      Loading job listings...
                    </td>
                  </tr>
                ) : filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-[#6B7694]">
                      No job postings found.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Job Title */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#0B1F4B] text-sm leading-snug">
                        {job.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-[#6B7694] mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job.location}
                        </span>
                        <span>•</span>
                        <span className="bg-[#E8F0FF] text-[#1E5BE0] font-medium px-2 py-0.5 rounded">
                          {job.jobType}
                        </span>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0756A8] font-bold text-xs flex items-center justify-center shrink-0 border border-blue-100">
                          {job.company.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#0B1F4B]">{job.company.name}</span>
                      </div>
                    </td>

                    {/* Compensation */}
                    <td className="px-5 py-4 font-semibold text-[#22B573]">
                      {job.salaryMin && job.salaryMax
                        ? `${job.salaryCurrency || "₹"}${(job.salaryMin / 100000).toFixed(1)}L - ${(job.salaryMax / 100000).toFixed(1)}L`
                        : "Competitive"}
                    </td>

                    {/* Posted Date */}
                    <td className="px-5 py-4 text-[#6B7694]">
                      {formatDate(job.postedDate)}
                    </td>

                    {/* Applicants */}
                    <td className="px-5 py-4 text-center font-bold text-[#0756A8]">
                      {job.applicantsCount || 0}
                    </td>

                    {/* Status Pill */}
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                          job.status === "Published"
                            ? "bg-[#D8F3E5] text-[#22B573]"
                            : job.status === "Draft"
                            ? "bg-[#FFE9D6] text-[#E8650A]"
                            : "bg-[#FFE0E0] text-[#D93636]"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/jobs/${job.id}`}>
                          <button
                            type="button"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#1E5BE0] hover:bg-slate-100 transition"
                            title="View Public Post"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>

                        {job.status !== "Published" ? (
                          <button
                            type="button"
                            onClick={() => updateStatus(job.id, "Published")}
                            className="bg-[#22B573] hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Publish</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => updateStatus(job.id, "Paused")}
                            className="border border-slate-200 text-slate-600 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <Pause className="w-3.5 h-3.5" />
                            <span>Pause</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => removeJob(job.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="Remove Post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
