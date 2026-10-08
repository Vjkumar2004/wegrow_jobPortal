"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { hrService } from "@/services/hr.service";
import Link from "next/link";
import { Job } from "@/types";
import { formatDate, formatSalary } from "@/lib/utils";
import {
  Briefcase,
  PlusCircle,
  Pause,
  Play,
  Trash2,
  Eye,
  MapPin,
  Clock,
  Users,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Filter,
  DollarSign,
} from "lucide-react";
import PostJobModal from "@/components/hr/PostJobModal";

export default function HRJobsClient({ initialJobs }: { initialJobs: Job[] }) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const { data: jobs = initialJobs } = useQuery({
    queryKey: ["hr-jobs"],
    queryFn: () => hrService.getMyJobs(),
    initialData: initialJobs.length > 0 ? initialJobs : undefined,
    staleTime: 30_000,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const toggleStatus = async (id: string) => {
    const target = jobs.find((j) => j.id === id);
    if (!target) return;
    const isPublished = target.status === "Published";
    try {
      if (isPublished) {
        await hrService.pauseJob(id);
      } else {
        await hrService.publishJob(id);
      }
      // Optimistic local update then refetch to sync server state
      queryClient.setQueryData<Job[]>(["hr-jobs"], (prev) =>
        (prev ?? []).map((j) => (j.id === id ? { ...j, status: isPublished ? "Paused" : "Published" } as Job : j))
      );
      showToast(`Job "${target.title}" is now ${isPublished ? "Paused" : "Published"}!`);
    } catch {
      showToast(`Failed to update status for "${target.title}".`);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteJob = async (id: string, jobTitle: string) => {
    if (!confirm(`Close the job opening "${jobTitle}"? It will no longer accept applications.`)) return;
    setDeletingId(id);
    try {
      const ok = await hrService.closeJob(id);
      if (ok) {
        queryClient.setQueryData<Job[]>(["hr-jobs"], (prev) =>
          (prev ?? []).filter((j) => j.id !== id)
        );
        showToast(`Job opening "${jobTitle}" has been closed.`);
      } else {
        showToast(`Failed to close "${jobTitle}". Please try again.`);
      }
    } catch {
      showToast(`Failed to close "${jobTitle}". Please try again.`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleJobCreated = (newJob: Job) => {
    queryClient.setQueryData<Job[]>(["hr-jobs"], (prev) => [newJob, ...(prev ?? [])]);
    showToast(`New job "${newJob.title}" published!`);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      filterStatus === "All" || job.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const activeCount = jobs.filter((j) => j.status === "Published").length;
  const totalApplicants = jobs.reduce((acc, j) => acc + (j.applicantsCount || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto w-full font-['Poppins',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1F4B] text-white px-5 py-3 rounded-xl shadow-xl border border-blue-400/20 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#22B573]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Embedded Post Job Modal */}
      <PostJobModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onJobCreated={handleJobCreated}
      />

      {/* 1. Header with Post Job Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#1E5BE0] text-xs font-bold uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5" /> Corporate Openings Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4B] tracking-tight">
            Manage Campus Job Listings
          </h1>
          <p className="text-sm text-[#6B7694] mt-1">
            Create, publish, pause, or view student applications for your active campus vacancies.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPostModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-[10px] transition shadow-md shadow-[#FF6B00]/25 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Job Opening</span>
        </button>
      </div>

      {/* 2. Quick Metrics Row (4 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)]">
          <span className="text-[11px] font-bold text-[#6B7694] uppercase tracking-wider">Total Listings</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4B] mt-1.5">{jobs.length}</div>
          <span className="text-xs text-[#1E5BE0] font-semibold mt-1 block">Campus Drive 2026</span>
        </div>
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)]">
          <span className="text-[11px] font-bold text-[#6B7694] uppercase tracking-wider">Published & Active</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#22B573] mt-1.5">{activeCount}</div>
          <span className="text-xs text-[#22B573] font-semibold mt-1 block">Accepting students</span>
        </div>
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)]">
          <span className="text-[11px] font-bold text-[#6B7694] uppercase tracking-wider">Applications Inflow</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#FF6B00] mt-1.5">{totalApplicants}</div>
          <span className="text-xs text-[#FF6B00] font-semibold mt-1 block">Across all positions</span>
        </div>
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)]">
          <span className="text-[11px] font-bold text-[#6B7694] uppercase tracking-wider">Avg Applicants</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#8B5CF6] mt-1.5">
            {jobs.length ? Math.round(totalApplicants / jobs.length) : 0}
          </div>
          <span className="text-xs text-[#8B5CF6] font-semibold mt-1 block">Per job opening</span>
        </div>
      </div>

      {/* 3. Search Bar & Status Filter Bar */}
      <div className="bg-white rounded-[14px] border border-[#EEF1F7] p-3.5 shadow-[0_4px_14px_rgba(11,31,75,0.05)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by job title, location, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F4F6FA] text-xs text-[#0B1F4B] placeholder-[#6B7694] pl-10 pr-4 py-2.5 rounded-[10px] border border-[#E3E8F0] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-[#6B7694] hidden sm:inline">Status:</span>
          <div className="inline-flex p-1 bg-[#F1F4F9] rounded-lg text-xs font-semibold w-full sm:w-auto">
            {["All", "Published", "Paused"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-md transition cursor-pointer ${
                  filterStatus === st
                    ? "bg-white text-[#1E5BE0] shadow-2xs font-bold"
                    : "text-[#6B7694] hover:text-[#0B1F4B]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Pixel-Perfect Jobs Table */}
      <div className="bg-white rounded-[16px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9FD] text-[#6B7694] font-semibold uppercase text-[11px] border-b border-[#EEF1F7]">
              <tr>
                <th className="py-4 px-5">Job Title & Work Mode</th>
                <th className="py-4 px-4">Experience</th>
                <th className="py-4 px-4">Annual CTC Package</th>
                <th className="py-4 px-4">Posted Date</th>
                <th className="py-4 px-4 text-center">Applicants</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF1F7]">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#6B7694]">
                    No job postings found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#F7F9FD]/60 transition-colors">
                    {/* Job Title & Details */}
                    <td className="py-4 px-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0 mt-0.5">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-[#0B1F4B] text-[13px] hover:text-[#1E5BE0] transition cursor-pointer">
                            {job.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#6B7694] mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#1E5BE0]" /> {job.location}
                            </span>
                            <span>•</span>
                            <span className="px-2 py-0.2 rounded-md bg-[#F1F4F9] text-[#0B1F4B] font-medium">
                              {job.workMode}
                            </span>
                            <span>•</span>
                            <span>{job.jobType}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Experience */}
                    <td className="py-4 px-4 text-[#0B1F4B] font-medium">
                      {job.experience}
                    </td>

                    {/* Salary Package */}
                    <td className="py-4 px-4 font-bold text-[#0B1F4B]">
                      {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                    </td>

                    {/* Posted Date */}
                    <td className="py-4 px-4 text-[#6B7694]">
                      {formatDate(job.postedDate)}
                    </td>

                    {/* Applicants Pill */}
                    <td className="py-4 px-4 text-center">
                      <Link
                        href="/hr/applicants"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F0FF] text-[#1E5BE0] hover:bg-[#d8e6ff] transition"
                        title="View candidate applications"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.applicantsCount || 0}</span>
                      </Link>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                          job.status === "Published"
                            ? "bg-[#E8F8EF] text-[#22B573] border border-[#C6F0D8]"
                            : "bg-[#FFF0E6] text-[#FF6B00] border border-[#FFE0CC]"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>

                    {/* Actions Group */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/jobs/${job.id}`}>
                          <button
                            type="button"
                            className="p-2 rounded-[8px] text-[#6B7694] hover:text-[#1E5BE0] hover:bg-[#E8F0FF] transition cursor-pointer"
                            title="View Public Job Posting"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>

                        <button
                          type="button"
                          onClick={() => toggleStatus(job.id)}
                          className={`p-2 rounded-[8px] transition cursor-pointer ${
                            job.status === "Published"
                              ? "text-[#6B7694] hover:text-[#FF6B00] hover:bg-[#FFF0E6]"
                              : "text-[#22B573] hover:bg-[#E8F8EF]"
                          }`}
                          title={job.status === "Published" ? "Pause Job" : "Publish Job"}
                        >
                          {job.status === "Published" ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteJob(job.id, job.title)}
                          disabled={deletingId === job.id}
                          className="p-2 rounded-[8px] text-[#6B7694] hover:text-[#EF4444] hover:bg-rose-50 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Close Job"
                        >
                          <Trash2 className="w-4 h-4" />
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
    </div>
  );
}
