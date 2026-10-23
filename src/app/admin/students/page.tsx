"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { adminService } from "@/services/admin.service";
import { StudentAdmin } from "@/types";
import {
  GraduationCap,
  ShieldAlert,
  Check,
  Search,
  School,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCollege, setFilterCollege] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  const fetchStudents = (pageToFetch: number) => {
    setIsLoading(true);
    adminService
      .getStudents({
        page: pageToFetch,
        limit: 10,
        search: searchQuery.trim() || undefined,
      })
      .then((res) => {
        setStudents(res.items);
        setTotalPages(res.totalPages);
        setTotalStudents(res.total);
        setPage(res.page);
      })
      .catch(() => setStudents([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchStudents(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const toggleStudentStatus = async (stu: StudentAdmin) => {
    const newStatus = stu.status === "Active" ? "Suspended" : "Active";
    try {
      await adminService.updateStudentStatus(stu.id, newStatus);
      setStudents((prev) =>
        prev.map((s) => (s.id === stu.id ? { ...s, status: newStatus } : s))
      );
      showToast(`${stu.name} has been ${newStatus === "Suspended" ? "suspended" : "reactivated"}.`);
    } catch (err: any) {
      showToast(err.response?.data?.message || `Failed to update status for ${stu.name}.`, "error");
    }
  };

  const deleteStudent = async (stu: StudentAdmin) => {
    if (!confirm(`Remove "${stu.name}" from the platform? This will suspend their account.`)) return;
    try {
      await adminService.updateStudentStatus(stu.id, "Suspended");
      setStudents((prev) => prev.filter((s) => s.id !== stu.id));
      showToast(`${stu.name} has been removed.`);
    } catch (err: any) {
      showToast(err.response?.data?.message || `Failed to remove ${stu.name}.`, "error");
    }
  };

  const colleges = ["ALL", ...Array.from(new Set(students.map((s) => s.college).filter(Boolean)))];

  const filtered = students.filter((stu) => {
    const matchesSearch =
      stu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.college.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollege = filterCollege === "ALL" || stu.college === filterCollege;
    return matchesSearch && matchesCollege;
  });

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-7 space-y-6">
        {/* Toast Alert */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl border text-xs font-semibold flex items-center gap-2 animate-bounce ${
              toast.type === "success"
                ? "bg-[#0B1F4B] text-white border-blue-400/20"
                : "bg-rose-600 text-white border-rose-300/30"
            }`}
          >
            {toast.type === "success" ? (
              <Check className="w-4 h-4 text-[#22B573]" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-white" />
            )}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Banner */}
        <div className="relative overflow-hidden rounded-[14px] p-4 sm:p-7 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] bg-gradient-to-r from-[#FFF5EE] via-[#F4F8FF] to-[#E9F2FF] flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0756A8] text-xs font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5" /> Candidate Registry & KYC
            </div>
            <h1 className="text-[20px] sm:text-[26px] font-bold text-[#0B1F4B] tracking-tight">
              Student Directory & Moderation
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[#6B7694] mt-1">
              Verify campus candidate profiles, inspect academic verification levels, track application rates, and moderate access.
            </p>
          </div>

          <div className="flex items-center justify-around sm:justify-start gap-3 bg-white rounded-xl p-3 border border-[#EEF1F7] shadow-sm w-full sm:w-auto shrink-0">
            <div className="text-center px-3">
              <div className="text-lg font-bold text-[#0B1F4B] leading-none">
                {students.length}
              </div>
              <div className="text-[11px] text-[#6B7694] mt-1">Verified Students</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-200" />
            <div className="text-center px-3">
              <div className="text-lg font-bold text-[#22B573] leading-none">
                {students.filter((s) => s.status === "Active").length}
              </div>
              <div className="text-[11px] text-[#6B7694] mt-1">Active Accounts</div>
            </div>
          </div>
        </div>

        {/* Search & College Filter */}
        <div className="bg-white rounded-[14px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, email, roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F7FB] text-xs text-[#0B1F4B] placeholder-[#6B7694] pl-9 pr-3 py-2 rounded-xl border border-transparent focus:border-[#1E5BE0] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <select
              value={filterCollege}
              onChange={(e) => setFilterCollege(e.target.value)}
              className="bg-[#F5F7FB] text-xs text-[#0B1F4B] px-3 py-2 rounded-xl border-none focus:outline-none cursor-pointer"
            >
              {colleges.map((col) => (
                <option key={col} value={col}>
                  {col === "ALL" ? "All Colleges" : col}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-[#6B7694] font-medium">
            Showing <strong className="text-[#0B1F4B]">{filtered.length}</strong> candidates
          </span>
        </div>

        {/* Formatted Table (Desktop Table + Mobile Cards) */}
        <div className="bg-white rounded-[14px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F7FB] text-[12px] font-semibold text-[#6B7694] h-[48px]">
                  <th className="px-5 py-3 rounded-l-lg">Student Profile</th>
                  <th className="px-5 py-3">Institution / College</th>
                  <th className="px-5 py-3 text-center">Batch</th>
                  <th className="px-5 py-3 text-center">Applications</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1F7] text-[13px]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-[#6B7694]">
                      Loading student directory...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-[#6B7694]">
                      No student records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((stu) => {
                    const initials = stu.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2);

                    return (
                      <tr key={stu.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Name & Email */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1E5BE0] to-blue-400 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                              {stu.avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={stu.avatarUrl}
                                  alt={stu.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                    e.currentTarget.parentElement!.innerText = initials;
                                  }}
                                />
                              ) : (
                                initials
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-[#0B1F4B] text-sm leading-snug">
                                {stu.name}
                              </p>
                              <p className="text-[11px] text-[#6B7694] mt-0.5">{stu.email}</p>
                              {stu.degree && (
                                <p className="text-[10px] text-[#6B7694] mt-0.5">{stu.degree}{stu.cgpa ? ` · CGPA ${stu.cgpa}` : ""}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* College */}
                        <td className="px-5 py-4 font-medium text-[#0B1F4B]">
                          <span className="flex items-center gap-1.5">
                            <School className="w-3.5 h-3.5 text-[#6B7694]" />
                            {stu.college}
                          </span>
                        </td>

                        {/* Batch */}
                        <td className="px-5 py-4 text-center text-[#6B7694] font-medium">
                          {stu.gradYear}
                        </td>

                        {/* Applications count */}
                        <td className="px-5 py-4 text-center font-bold text-[#0756A8]">
                          {stu.applicationsCount}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                              stu.status === "Active"
                                ? "bg-[#D8F3E5] text-[#22B573]"
                                : "bg-[#FFE0E0] text-[#D93636]"
                            }`}
                          >
                            {stu.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => toggleStudentStatus(stu)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                stu.status === "Active"
                                    ? "border border-rose-200 text-rose-600 hover:bg-rose-50"
                                    : "bg-[#22B573] text-white hover:bg-emerald-600 shadow-xs"
                              }`}
                            >
                              {stu.status === "Active" ? "Suspend" : "Re-activate"}
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteStudent(stu)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                              title="Remove student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (block md:hidden) */}
          <div className="block md:hidden divide-y divide-[#EEF1F7]">
            {isLoading ? (
              <div className="py-10 px-4 text-center text-[#6B7694] text-xs">
                Loading student directory...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-10 px-4 text-center text-[#6B7694] text-xs">
                No student records found.
              </div>
            ) : (
              filtered.map((stu) => {
                const initials = stu.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2);

                return (
                  <div key={stu.id} className="p-4 space-y-3">
                    {/* Header: Avatar, Name, Email, Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#1E5BE0] to-blue-400 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                          {stu.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={stu.avatarUrl}
                              alt={stu.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                                e.currentTarget.parentElement!.innerText = initials;
                              }}
                            />
                          ) : (
                            initials
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-[#0B1F4B] text-[15px] leading-snug truncate">
                            {stu.name}
                          </h4>
                          <p className="text-[11px] text-[#6B7694] truncate">{stu.email}</p>
                          {stu.degree && (
                            <p className="text-[10px] text-[#6B7694] truncate">{stu.degree}{stu.cgpa ? ` · CGPA ${stu.cgpa}` : ""}</p>
                          )}
                        </div>
                      </div>

                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                          stu.status === "Active"
                            ? "bg-[#D8F3E5] text-[#22B573]"
                            : "bg-[#FFE0E0] text-[#D93636]"
                        }`}
                      >
                        {stu.status}
                      </span>
                    </div>

                    {/* Metadata: College & Batch */}
                    <div className="flex items-center justify-between text-[11px] text-[#6B7694] bg-[#F8FAFC] rounded-lg p-2">
                      <span className="flex items-center gap-1.5 truncate max-w-[70%]">
                        <School className="w-3.5 h-3.5 text-[#6B7694] shrink-0" />
                        <span className="truncate">{stu.college}</span>
                      </span>
                      <span className="font-semibold text-slate-700">Class of {stu.gradYear}</span>
                    </div>

                    {/* Applications Count */}
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-[#6B7694]">Total Applications</span>
                      <span className="font-bold text-[#0756A8]">{stu.applicationsCount} Submissions</span>
                    </div>

                    {/* Actions row */}
                    <div className="pt-2 border-t border-[#EEF1F7] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => toggleStudentStatus(stu)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          stu.status === "Active"
                            ? "border border-rose-200 text-rose-600 hover:bg-rose-50"
                            : "bg-[#22B573] text-white hover:bg-emerald-600 shadow-xs"
                        }`}
                      >
                        {stu.status === "Active" ? "Suspend Account" : "Re-activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteStudent(stu)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                        title="Remove student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Controls */}
          {totalStudents > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#EEF1F7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-slate-50/50">
              <span className="text-[#6B7694]">
                Showing <strong className="text-[#0B1F4B]">{(page - 1) * 10 + 1}</strong> to{" "}
                <strong className="text-[#0B1F4B]">{Math.min(page * 10, totalStudents)}</strong> of{" "}
                <strong className="text-[#0B1F4B]">{totalStudents}</strong> students
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isLoading}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E3E8F0] bg-white text-[#0B1F4B] font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
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
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition cursor-pointer ${
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
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E3E8F0] bg-white text-[#0B1F4B] font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
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
