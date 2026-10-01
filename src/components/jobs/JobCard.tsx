"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Job } from "@/types";
import { MapPin, Briefcase, IndianRupee, Clock, Bookmark, Building2 } from "lucide-react";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { formatSalary, formatDate } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  onSave?: (jobId: string) => void;
  isSaved?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSave, isSaved = false }) => {
  const [saved, setSaved] = useState(isSaved);

  const handleToggleSave = () => {
    setSaved(!saved);
    if (onSave) {
      onSave(job.id);
    }
  };

  return (
    <div className="group relative bg-white border border-slate-200/90 hover:border-[#0756A8]/40 rounded-xl p-5 transition-all duration-200 hover:shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
              {job.company.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 group-hover:text-[#0756A8] transition-colors line-clamp-1 text-base">
                <Link href={`/jobs/${job.id}`}>{job.title}</Link>
              </h4>
              <p className="text-xs text-slate-500 font-medium">{job.company.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleSave}
            className={`p-2 rounded-lg border transition-colors ${
              saved
                ? "bg-amber-50 text-[#F79400] border-[#F79400]/30"
                : "border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
            title={saved ? "Saved" : "Save Job"}
          >
            <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-slate-600 font-medium">
          <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            {job.jobType}
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
            <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
          </span>
          <span className="inline-flex items-center gap-1 bg-blue-50 text-[#0756A8] px-2.5 py-1 rounded-md">
            {job.workMode}
          </span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mt-3.5">
          {job.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="neutral" size="sm">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 4 && (
            <span className="text-[11px] text-slate-400 self-center">+{job.skills.length - 4} more</span>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          Posted {formatDate(job.postedDate)}
        </span>
        <div className="flex items-center gap-2">
          <Link href={`/jobs/${job.id}`}>
            <Button variant="soft" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
