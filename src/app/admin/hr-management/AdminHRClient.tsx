"use client";

import React, { useState } from "react";
import { Company } from "@/types";
import { Button } from "@/components/common/Button";
import { StatusBadge } from "@/components/common/Badge";
import { formatDate } from "@/lib/utils";
import { Building2, Check, X, ShieldAlert, Trash2, Eye } from "lucide-react";
import { adminService } from "@/services/admin.service";

export default function AdminHRClient({ initialCompanies }: { initialCompanies: Company[] }) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [tab, setTab] = useState<"Pending" | "Approved" | "Suspended">("Approved");

  const updateStatus = async (companyId: string, status: "Approved" | "Suspended" | "Pending") => {
    await adminService.updateCompanyStatus(companyId, status);
    setCompanies(
      companies.map((c) => (c.id === companyId ? { ...c, status } : c))
    );
  };

  const removeCompany = (id: string) => {
    if (confirm("Are you sure you want to remove this employer account?")) {
      setCompanies(companies.filter((c) => c.id !== id));
    }
  };

  const displayed = companies.filter((c) => c.status === tab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">HR & Company Management</h1>
        <p className="text-xs text-slate-500 mt-1">
          Verify new recruiting organizations, approve listings, or suspend violating profiles.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
        <button
          onClick={() => setTab("Approved")}
          className={`pb-3 transition-colors ${
            tab === "Approved" ? "border-b-2 border-[#0756A8] text-[#0756A8]" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Approved Companies ({companies.filter((c) => c.status === "Approved").length})
        </button>
        <button
          onClick={() => setTab("Pending")}
          className={`pb-3 transition-colors ${
            tab === "Pending" ? "border-b-2 border-[#F79400] text-[#F79400]" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Pending Approvals ({companies.filter((c) => c.status === "Pending").length})
        </button>
        <button
          onClick={() => setTab("Suspended")}
          className={`pb-3 transition-colors ${
            tab === "Suspended" ? "border-b-2 border-rose-600 text-rose-600" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Suspended Accounts ({companies.filter((c) => c.status === "Suspended").length})
        </button>
      </div>

      {/* Companies List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Company Profile</th>
                <th className="py-3.5 px-4">Industry</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Active Jobs</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayed.map((comp) => (
                <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900 text-sm">{comp.name}</p>
                    <a href={comp.website} target="_blank" rel="noreferrer" className="text-[11px] text-[#0756A8] hover:underline">
                      {comp.website}
                    </a>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{comp.industry}</td>
                  <td className="py-3.5 px-4 text-slate-500">{comp.location}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{comp.activeJobsCount}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={comp.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {comp.status === "Pending" ? (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => updateStatus(comp.id, "Approved")}
                            title="Approve Company"
                          >
                            <Check className="w-3.5 h-3.5 mr-1" /> Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => updateStatus(comp.id, "Suspended")}
                            title="Reject / Deny"
                          >
                            <X className="w-3.5 h-3.5 mr-1" /> Reject
                          </Button>
                        </>
                      ) : comp.status === "Approved" ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(comp.id, "Suspended")}
                            className="text-amber-700 hover:bg-amber-50"
                          >
                            Suspend
                          </Button>
                          <button
                            onClick={() => removeCompany(comp.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            title="Remove Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <Button
                          variant="soft"
                          size="sm"
                          onClick={() => updateStatus(comp.id, "Approved")}
                        >
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
