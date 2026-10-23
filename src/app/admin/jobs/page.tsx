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
  MapPin,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { getCompanyLogoUrl } from "@/lib/utils";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchJobs = (pageToFetch: number) => {
    setIsLoading(true);
    adminService
      .getJobs({
        page: pageToFetch,
        limit: 10,
        status: filterStatus !== "ALL" ? filterStatus : undefined,
        search: searchQuery.trim() || undefined,
      })
      .then((res) => {
        setJobs(res.items);
        setTotalPages(res.totalPages);
        setTotalJobs(res.total);
        setPage(res.page);
      })
      .catch(() => {
        setJobs([]);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchJobs(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (page === 1) {
      fetchJobs(1);
    } else {
      setPage(1);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: "Published" | "Paused" | "Closed" | "Draft") => {
    try {
      const ok = await adminService.updateJobStatus(jobId, newStatus);
      if (ok) {
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
        );
        showToast(`Job status updated to ${newStatus}.`);
      } else {
        showToast("Failed to update job status.", "error");
      }
    } catch {
      showToast("Error updating job status.", "error");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesType = filterType === "ALL" || job.jobType === filterType;
    return matchesType;
  });

  const totalApplicantsCount = jobs.reduce((sum, j) => sum + (j.applicantsCount || 0), 0);

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-7 space-y-6">
        {/* Toast Alert */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl border text-xs font-semibold flex items-center gap-2 animate-bounce ${
              toast.type === "success"
                ? "bg-[#0B1F4B] text-white border-blue-400/20"
                : "bg-rose-600 text-white border-rose-500/20"
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Banner */}
        <div className="relative overflow-hidden rounded-[14px] p-4 sm:p-7 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] bg-gradient-to-r from-[#FFF5EE] via-[#F4F8FF] to-[#E9F2FF] flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0756A8] text-xs font-bold uppercase tracking-wider mb-2">
              <Briefcase className="w-3.5 h-3.5" /> Opportunity Moderation Hub
            </div>
            <h1 className="text-[20px] sm:text-[26px] font-bold text-[#0B1F4B] tracking-tight">
              Jobs & Openings Moderation
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[#6B7694] mt-1">
              Supervise campus postings, verify salary packages and eligibility criteria, approve new listings, or pause active recruitments.
            </p>
          </div>

          <div className="flex items-center justify-around sm:justify-start gap-3 bg-white rounded-xl p-3 border border-[#EEF1F7] shadow-sm w-full sm:w-auto shrink-0">
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
            <div className="h-8 w-[1px] bg-slate-200" />
            <div className="text-center px-3">
              <div className="text-lg font-bold text-[#0756A8] leading-none">
                {totalApplicantsCount}
              </div>
              <div className="text-[11px] text-[#6B7694] mt-1">Total Applicants</div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-[14px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
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

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#F5F7FB] text-xs text-[#0B1F4B] px-3 py-2 rounded-xl border-none focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Paused">Paused</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <span className="text-xs text-[#6B7694] font-medium">
            Showing <strong className="text-[#0B1F4B]">{filteredJobs.length}</strong> active posts
          </span>
        </div>

        {/* Formatted Table (Responsive: Desktop Table + Mobile Cards) */}
        <div className="bg-white rounded-[14px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
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
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0756A8] font-bold text-xs flex items-center justify-center shrink-0 border border-blue-100 overflow-hidden">
                          {job.company.id ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={getCompanyLogoUrl(job.company, job.company.id)}
                              alt={job.company.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                                e.currentTarget.parentElement!.innerText = job.company.name.substring(0, 2).toUpperCase();
                              }}
                            />
                          ) : (
                            job.company.name.substring(0, 2).toUpperCase()
                          )}
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
                            : job.status === "Paused"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job.id, e.target.value as any)}
                          className="text-[11px] font-medium bg-[#F5F7FB] hover:bg-slate-100 text-[#0B1F4B] px-2 py-1 rounded-lg border border-[#E3E8F0] cursor-pointer focus:outline-none"
                          title="Change moderation status"
                        >
                          <option value="Published">Publish</option>
                          <option value="Paused">Pause</option>
                          <option value="Closed">Close</option>
                          <option value="Draft">Draft</option>
                        </select>
                        <Link
                          href={`/student/jobs/${job.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#1E5BE0] hover:bg-slate-100 transition inline-flex"
                          title="View Public Post"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (block md:hidden) */}
          <div className="block md:hidden divide-y divide-[#EEF1F7]">
            {isLoading ? (
              <div className="py-10 px-4 text-center text-[#6B7694] text-xs">
                Loading job listings...
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="py-10 px-4 text-center text-[#6B7694] text-xs">
                No job postings found.
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job.id} className="p-4 space-y-3">
                  {/* Top: Company Logo + Title + Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0756A8] font-bold text-xs flex items-center justify-center shrink-0 border border-blue-100 overflow-hidden">
                        {job.company.id ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={getCompanyLogoUrl(job.company, job.company.id)}
                            alt={job.company.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                              e.currentTarget.parentElement!.innerText = job.company.name.substring(0, 2).toUpperCase();
                            }}
                          />
                        ) : (
                          job.company.name.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-[#0B1F4B] text-[15px] leading-snug truncate">
                          {job.title}
                        </h4>
                        <p className="text-[11px] text-[#6B7694] truncate">{job.company.name}</p>
                      </div>
                    </div>

                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                        job.status === "Published"
                          ? "bg-[#D8F3E5] text-[#22B573]"
                          : job.status === "Draft"
                          ? "bg-[#FFE9D6] text-[#E8650A]"
                          : job.status === "Paused"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  {/* Metadata Chips: Location, Job Type, Salary */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F1F4F9] text-[#6B7694]">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </span>
                    <span className="bg-[#E8F0FF] text-[#1E5BE0] font-semibold px-2 py-0.5 rounded-md">
                      {job.jobType}
                    </span>
                    <span className="font-bold text-[#22B573] px-2 py-0.5 rounded-md bg-emerald-50">
                      {job.salaryMin && job.salaryMax
                        ? `${job.salaryCurrency || "₹"}${(job.salaryMin / 100000).toFixed(1)}L - ${(job.salaryMax / 100000).toFixed(1)}L`
                        : "Competitive"}
                    </span>
                  </div>

                  {/* Bottom: Date, Applicants count, Moderation & View button */}
                  <div className="pt-2 border-t border-[#EEF1F7] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6B7694]">
                    <span>Posted {formatDate(job.postedDate)}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0756A8]">{job.applicantsCount || 0} Applicants</span>
                      <select
                        value={job.status}
                        onChange={(e) => handleStatusChange(job.id, e.target.value as any)}
                        className="text-[10px] font-medium bg-[#F5F7FB] text-[#0B1F4B] px-2 py-1 rounded border border-[#E3E8F0] cursor-pointer"
                      >
                        <option value="Published">Publish</option>
                        <option value="Paused">Pause</option>
                        <option value="Closed">Close</option>
                        <option value="Draft">Draft</option>
                      </select>
                      <Link
                        href={`/student/jobs/${job.id}`}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-[#1E5BE0] font-bold rounded-lg hover:bg-blue-100 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {totalJobs > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#EEF1F7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-slate-50/50">
              <span className="text-[#6B7694]">
                Showing <strong className="text-[#0B1F4B]">{(page - 1) * 10 + 1}</strong> to{" "}
                <strong className="text-[#0B1F4B]">{Math.min(page * 10, totalJobs)}</strong> of{" "}
                <strong className="text-[#0B1F4B]">{totalJobs}</strong> postings
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isLoading}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E3E8F0] bg-white text-[#0B1F4B] font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      disabled={isLoading}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition ${
                        page === pNum
                          ? "bg-[#1E5BE0] text-white shadow-sm"
                          : "text-[#6B7694] hover:bg-slate-100"
                      }`}
                    >
                      {pNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || isLoading}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E3E8F0] bg-white text-[#0B1F4B] font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
