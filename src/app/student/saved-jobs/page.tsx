import React from "react";
import Link from "next/link";
import { studentService } from "@/services/student.service";
import { JobCard } from "@/components/jobs/JobCard";
import { Bookmark, ChevronRight, Briefcase } from "lucide-react";

export const metadata = {
  title: "Saved Jobs | WeGrow Student",
  description: "View and apply to bookmarked positions before applications close.",
};

export default async function StudentSavedJobsPage() {
  const savedJobs = await studentService.getSavedJobs();

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedJobs.map((job) => (
          <JobCard key={job.id} job={job} isSaved={true} />
        ))}
      </div>
    </div>
  );
}
