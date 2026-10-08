"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { JobCard } from "@/components/jobs/JobCard";
import { Bookmark, Briefcase } from "lucide-react";
import { Job } from "@/types";

export default function StudentSavedJobsPage() {
  const { data: savedJobs = [] } = useQuery<Job[]>({
    queryKey: ["student-saved-jobs"],
    queryFn: () => studentService.getSavedJobs(),
    staleTime: 30_000,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#1E5BE0] text-xs font-bold uppercase tracking-wider mb-2">
            <Bookmark className="w-3.5 h-3.5" /> Bookmarked Roles
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F4B] tracking-tight">Saved Jobs</h1>
          <p className="text-sm text-[#6B7694] mt-1">
            Revisit bookmarked roles and submit applications before deadlines close.
          </p>
        </div>

        <Link
          href="/student/jobs"
          className="inline-flex items-center justify-center gap-2 bg-[#1E5BE0] hover:bg-[#1548b8] text-white text-sm font-semibold px-5 py-2.5 rounded-[10px] shadow-sm transition-all"
        >
          <Briefcase className="w-4 h-4" />
          <span>Browse All Jobs</span>
        </Link>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#D2DAE8] p-12 text-center max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#0B1F4B] mb-2">No Saved Jobs Yet</h3>
          <p className="text-sm text-[#6B7694] mb-6">
            You have not bookmarked any jobs yet. Explore available jobs and save roles to review or apply later.
          </p>
          <Link
            href="/student/jobs"
            className="inline-flex items-center gap-2 bg-[#1E5BE0] hover:bg-[#1548b8] text-white text-sm font-semibold px-5 py-2.5 rounded-[10px] transition shadow-sm"
          >
            <Briefcase className="w-4 h-4" />
            <span>Discover Open Positions</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} isSaved={true} />
          ))}
        </div>
      )}
    </div>
  );
}
