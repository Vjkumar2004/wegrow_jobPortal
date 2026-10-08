"use client";

import React, { useState } from "react";
import { Company } from "@/types";
import {
  Building2,
  Check,
  X,
  ShieldAlert,
  Trash2,
  Eye,
  Search,
  ExternalLink,
  MapPin,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import { getCompanyLogoProxyUrl } from "@/lib/utils";

export default function AdminHRClient({ initialCompanies }: { initialCompanies: Company[] }) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [tab, setTab] = useState<"Pending" | "Approved" | "Suspended" | "Rejected">("Pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [rejectingCompanyId, setRejectingCompanyId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);
  const [actionError, setActionError] = useState("");

  const refreshCompanies = async () => {
    try {
      const res = await adminService.getCompanies();
      setCompanies(res);
    } catch {
      // Keep existing on network failure
    }
  };

  React.useEffect(() => {
    refreshCompanies();
  }, []);

  const updateStatus = async (companyId: string, status: "Approved" | "Suspended" | "Pending") => {
    setActionError("");
    try {
      await adminService.updateCompanyStatus(companyId, status);
      await refreshCompanies();
      if (selectedCompany && selectedCompany.id === companyId) {
        setSelectedCompany({ ...selectedCompany, status });
      }
    } catch (err: any) {
      setActionError(err?.response?.data?.message || `Failed to update status to ${status}`);
    }
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingCompanyId) return;
    if (!rejectionReason.trim() || rejectionReason.trim().length < 3) {
      setActionError("Rejection reason must be at least 3 characters.");
      return;
    }

    setIsSubmittingReject(true);
    setActionError("");
    try {
      await adminService.rejectCompany(rejectingCompanyId, rejectionReason.trim());
      await refreshCompanies();
      setRejectingCompanyId(null);
      setRejectionReason("");
      if (selectedCompany && selectedCompany.id === rejectingCompanyId) {
        setSelectedCompany({ ...selectedCompany, status: "Rejected", rejectionReason: rejectionReason.trim() });
      }
    } catch (err: any) {
      setActionError(err?.response?.data?.message || "Failed to reject company registration.");
    } finally {
      setIsSubmittingReject(false);
    }
  };

  const removeCompany = (id: string) => {
    if (confirm("Are you sure you want to remove this employer account?")) {
      setCompanies(companies.filter((c) => c.id !== id));
    }
  };

  const displayed = companies
    .filter((c) => c.status === tab)
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const pendingCount = companies.filter((c) => c.status === "Pending").length;
  const approvedCount = companies.filter((c) => c.status === "Approved").length;
  const suspendedCount = companies.filter((c) => c.status === "Suspended").length;
  const rejectedCount = companies.filter((c) => c.status === "Rejected").length;

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[14px] p-6 sm:p-7 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] bg-gradient-to-r from-[#FFF5EE] via-[#F4F8FF] to-[#E9F2FF] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0756A8] text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" /> Corporate Partners Moderation
          </div>
          <h1 className="text-[22px] sm:text-[26px] font-bold text-[#0B1F4B] tracking-tight">
            HR & Company Management
          </h1>
          <p className="text-[13px] text-[#6B7694] mt-1">
            Review partner registrations, verify official hiring credentials, approve corporate postings, and suspend accounts.
          </p>
        </div>

        {/* Counter Pill */}
        <div className="flex items-center gap-3 bg-white rounded-xl p-2.5 border border-[#EEF1F7] shadow-sm shrink-0">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#22B573] text-center">
            <div className="text-base font-bold leading-none">{approvedCount}</div>
            <div className="text-[10px] font-semibold mt-0.5">Approved</div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-50 text-[#FF6B00] text-center">
            <div className="text-base font-bold leading-none">{pendingCount}</div>
            <div className="text-[10px] font-semibold mt-0.5">Pending</div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-center">
            <div className="text-base font-bold leading-none">{rejectedCount}</div>
            <div className="text-[10px] font-semibold mt-0.5">Rejected</div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-center">
            <div className="text-base font-bold leading-none">{suspendedCount}</div>
            <div className="text-[10px] font-semibold mt-0.5">Suspended</div>
          </div>
        </div>
      </div>

      {actionError && (
        <div className="p-4 bg-rose-50 text-rose-700 text-xs font-medium rounded-xl border border-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter bar and Tabs */}
      <div className="bg-white rounded-[14px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Modern Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setTab("Approved")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              tab === "Approved"
                ? "bg-[#E3EEFF] text-[#1E5BE0] shadow-xs"
                : "text-[#6B7694] hover:bg-slate-50 hover:text-[#0B1F4B]"
            }`}
          >
            <span>Approved Partners</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white font-black text-[#1E5BE0]">
              {approvedCount}
            </span>
          </button>
          <button
            onClick={() => setTab("Pending")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              tab === "Pending"
                ? "bg-[#FFE9D6] text-[#E8650A] shadow-xs"
                : "text-[#6B7694] hover:bg-slate-50 hover:text-[#0B1F4B]"
            }`}
          >
            <span>Pending Review</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white font-black text-[#E8650A]">
              {pendingCount}
            </span>
          </button>
          <button
            onClick={() => setTab("Rejected")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              tab === "Rejected"
                ? "bg-slate-200 text-slate-800 shadow-xs"
                : "text-[#6B7694] hover:bg-slate-50 hover:text-[#0B1F4B]"
            }`}
          >
            <span>Rejected</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white font-black text-slate-800">
              {rejectedCount}
            </span>
          </button>
          <button
            onClick={() => setTab("Suspended")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              tab === "Suspended"
                ? "bg-rose-100 text-rose-700 shadow-xs"
                : "text-[#6B7694] hover:bg-slate-50 hover:text-[#0B1F4B]"
            }`}
          >
            <span>Suspended</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white font-black text-rose-700">
              {suspendedCount}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search company, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F5F7FB] text-xs text-[#0B1F4B] placeholder-[#6B7694] pl-9 pr-3 py-2 rounded-xl border border-transparent focus:border-[#1E5BE0] focus:bg-white focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Styled Table Container */}
      <div className="bg-white rounded-[14px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F7FB] text-[12px] font-semibold text-[#6B7694] h-[48px]">
                <th className="px-5 py-3 rounded-l-lg">Company Profile</th>
                <th className="px-5 py-3">Industry</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3 text-center">Active Jobs</th>
                <th className="px-5 py-3 text-center">Compliance Status</th>
                <th className="px-5 py-3 text-right rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF1F7] text-[13px]">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#6B7694]">
                    <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No companies match your search or filter.
                  </td>
                </tr>
              ) : (
                displayed.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Profile */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0756A8] font-bold text-sm flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs overflow-hidden">
                          {comp.id || comp.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={comp.id ? getCompanyLogoProxyUrl(comp.id) : comp.logo}
                              alt={comp.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                target.style.display = "none";
                                if (target.parentElement) {
                                  target.parentElement.innerText = comp.name.substring(0, 2).toUpperCase();
                                }
                              }}
                            />
                          ) : (
                            comp.name.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[#0B1F4B] text-sm leading-snug">
                            {comp.name}
                          </p>
                          {comp.website && (
                            <a
                              href={comp.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-[#1E5BE0] hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <span>{comp.website.replace("https://", "")}</span>
                              <ExternalLink className="w-3 h-3 text-[#1E5BE0]" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Industry */}
                    <td className="px-5 py-4 text-[#0B1F4B] font-medium">
                      {comp.industry || "Information Technology"}
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4 text-[#6B7694]">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#6B7694]" />
                        {comp.location || "Pan-India"}
                      </span>
                    </td>

                    {/* Active Jobs */}
                    <td className="px-5 py-4 text-center font-bold text-[#0756A8]">
                      {comp.activeJobsCount ?? 0}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                          comp.status === "Approved"
                            ? "bg-[#D8F3E5] text-[#22B573]"
                            : comp.status === "Pending"
                            ? "bg-[#FFE9D6] text-[#E8650A]"
                            : "bg-[#FFE0E0] text-[#D93636]"
                        }`}
                      >
                        {comp.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {comp.status === "Pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => updateStatus(comp.id, "Approved")}
                              className="bg-[#22B573] hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRejectingCompanyId(comp.id);
                                setRejectionReason("");
                                setActionError("");
                              }}
                              className="border border-rose-200 text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}

                        {comp.status === "Approved" && (
                          <button
                            type="button"
                            onClick={() => updateStatus(comp.id, "Suspended")}
                            className="border border-rose-200 text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Suspend</span>
                          </button>
                        )}

                        {comp.status === "Suspended" && (
                          <button
                            type="button"
                            onClick={() => updateStatus(comp.id, "Approved")}
                            className="bg-[#1E5BE0] hover:bg-[#1548b8] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <span>Re-activate</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedCompany(comp)}
                          className="p-1.5 text-slate-500 hover:text-[#1E5BE0] rounded-lg hover:bg-blue-50 transition"
                          title="View Full Profile Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeCompany(comp.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="Remove Partner"
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

      {/* Full Company Profile Review Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-[#0756A8] overflow-hidden">
                  {selectedCompany.id || selectedCompany.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedCompany.id ? getCompanyLogoProxyUrl(selectedCompany.id) : selectedCompany.logo}
                      alt={selectedCompany.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = "none";
                        if (target.parentElement) {
                          target.parentElement.innerText = selectedCompany.name.substring(0, 2).toUpperCase();
                        }
                      }}
                    />
                  ) : (
                    selectedCompany.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1F4B]">{selectedCompany.name}</h3>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                    selectedCompany.status === "Approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : selectedCompany.status === "Pending"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-rose-100 text-rose-700"
                  }`}>
                    {selectedCompany.status}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCompany(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-700">
              {selectedCompany.tagline && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 italic text-slate-600">
                  &ldquo;{selectedCompany.tagline}&rdquo;
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Industry</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{selectedCompany.industry || "Information Technology"}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Workforce Scale</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{selectedCompany.size || "100+ employees"}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location / HQ</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{selectedCompany.location || "Bengaluru, Karnataka"}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Corporate Website</div>
                  <a
                    href={selectedCompany.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[#1E5BE0] hover:underline mt-0.5 block truncate"
                  >
                    {selectedCompany.website || "N/A"}
                  </a>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">HR Desk Email</div>
                  <div className="font-semibold text-slate-900 mt-0.5 truncate">{selectedCompany.hrEmail || "recruitment@company.com"}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Phone</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{selectedCompany.hrPhone || "N/A"}</div>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-[#0B1F4B] uppercase tracking-wider mb-1.5">About Organization</div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 leading-relaxed text-slate-600">
                  {selectedCompany.about || selectedCompany.description || "No description provided."}
                </div>
              </div>

              {selectedCompany.culture && (
                <div>
                  <div className="text-[11px] font-bold text-[#0B1F4B] uppercase tracking-wider mb-1.5">Campus Work Culture & Fresher Onboarding</div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 leading-relaxed text-slate-600">
                    {selectedCompany.culture}
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">Joined: {selectedCompany.joinedDate}</span>
              <div className="flex items-center gap-2">
                {selectedCompany.status === "Pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => updateStatus(selectedCompany.id, "Approved")}
                      className="px-4 py-2 bg-[#22B573] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Registration
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRejectingCompanyId(selectedCompany.id);
                        setRejectionReason("");
                        setActionError("");
                      }}
                      className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <X className="w-3.5 h-3.5" /> Reject Registration
                    </button>
                  </>
                )}
                {selectedCompany.status === "Approved" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedCompany.id, "Suspended")}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" /> Suspend Account
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedCompany(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation & Reason Modal */}
      {rejectingCompanyId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100 shrink-0">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Reject Company Registration</h3>
                <p className="text-xs text-slate-500">Provide an official reason for company rejection</p>
              </div>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Rejection Reason *
                </label>
                <textarea
                  required
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Incomplete corporate verification documents or invalid official website..."
                  className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs p-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setRejectingCompanyId(null);
                    setRejectionReason("");
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReject}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isSubmittingReject ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
