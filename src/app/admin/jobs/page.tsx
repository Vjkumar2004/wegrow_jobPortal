"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/layouts/AdminLayout";
import { MOCK_JOBS } from "@/constants/mockData";
import { Job } from "@/types";
import { StatusBadge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { formatDate } from "@/lib/utils";
import { Check, X, Trash2, Eye } from "lucide-react";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);

  const updateStatus = (id: string, status: any) => {
    setJobs(jobs.map((j) => (j.id === id ? { ...j, status } : j)));
  };

  const removeJob = (id: string) => {
    if (confirm("Permanently remove this job from portal?")) {
      setJobs(jobs.filter((j) => j.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Job Moderation</h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise job vacancies submitted by hiring organizations across campus streams.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Job Role</th>
                  <th className="py-3.5 px-4">Hiring Company</th>
                  <th className="py-3.5 px-4">Posted Date</th>
                  <th className="py-3.5 px-4">Applicants</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 text-sm">{job.title}</p>
                      <p className="text-[11px] text-slate-400">{job.location} • {job.jobType}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{job.company.name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(job.postedDate)}</td>
                    <td className="py-3.5 px-4 font-bold text-[#0756A8]">{job.applicantsCount || 0}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/jobs/${job.id}`}>
                          <button className="p-1.5 rounded-lg text-slate-400 hover:text-[#0756A8] hover:bg-slate-100" title="View Public Post">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        {job.status !== "Published" ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => updateStatus(job.id, "Published")}
                          >
                            Approve
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(job.id, "Paused")}
                          >
                            Pause
                          </Button>
                        )}
                        <button
                          onClick={() => removeJob(job.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Remove Post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
