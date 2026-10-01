"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { MOCK_APPLICATIONS } from "@/constants/mockData";
import { StatusBadge } from "@/components/common/Badge";
import { formatDate } from "@/lib/utils";
import { Building2, User, Clock } from "lucide-react";

export default function AdminApplicationsPage() {
  const [applications] = useState(MOCK_APPLICATIONS);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform Applications</h1>
          <p className="text-xs text-slate-500 mt-1">
            Global view of candidate job submissions and their status across companies.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Candidate</th>
                  <th className="py-3.5 px-4">Job Role</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 text-sm">{app.applicantName}</p>
                      <p className="text-[11px] text-slate-400">{app.applicantEmail}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{app.jobTitle}</td>
                    <td className="py-3.5 px-4 text-slate-600">{app.companyName}</td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(app.appliedDate)}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} />
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
