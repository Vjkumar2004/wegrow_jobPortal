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
  Mail,
  UserCheck,
  TrendingUp,
} from "lucide-react";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCollege, setFilterCollege] = useState("ALL");

  useEffect(() => {
    adminService
      .getStudents()
      .then((data) => setStudents(data))
      .catch(() => setStudents([]))
      .finally(() => setIsLoading(false));
  }, []);

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
      showToast(`Student ${stu.name} has been successfully ${newStatus === "Suspended" ? "suspended" : "activated"}.`);
    } catch (err: any) {
      showToast(err.response?.data?.message || `Failed to update status for ${stu.name}.`, "error");
    }
  };

  const colleges = ["ALL", ...Array.from(new Set(students.map((s) => s.college)))];

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
        <div className="relative overflow-hidden rounded-[14px] p-6 sm:p-7 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] bg-gradient-to-r from-[#FFF5EE] via-[#F4F8FF] to-[#E9F2FF] flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0756A8] text-xs font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5" /> Candidate Registry & KYC
            </div>
            <h1 className="text-[22px] sm:text-[26px] font-bold text-[#0B1F4B] tracking-tight">
              Student Directory & Moderation
            </h1>
            <p className="text-[13px] text-[#6B7694] mt-1">
              Verify campus candidate profiles, inspect academic verification levels, track application rates, and moderate access.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[#EEF1F7] shadow-sm shrink-0">
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

        {/* Formatted Table */}
        <div className="bg-white rounded-[14px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F7FB] text-[12px] font-semibold text-[#6B7694] h-[48px]">
                  <th className="px-5 py-3 rounded-l-lg">Student Profile</th>
                  <th className="px-5 py-3">Institution / College</th>
                  <th className="px-5 py-3 text-center">Batch</th>
                  <th className="px-5 py-3">Profile Completion</th>
                  <th className="px-5 py-3 text-center">Applications</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1F7] text-[13px]">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-[#6B7694]">
                      Loading student directory...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-[#6B7694]">
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
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1E5BE0] to-blue-400 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                              {initials}
                            </div>
                            <div>
                              <p className="font-semibold text-[#0B1F4B] text-sm leading-snug">
                                {stu.name}
                              </p>
                              <p className="text-[11px] text-[#6B7694] mt-0.5">{stu.email}</p>
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

                        {/* Completion Progress Bar */}
                        <td className="px-5 py-4">
                          <div className="w-36 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-[#0B1F4B]">{stu.completionPercentage}%</span>
                              <span className="text-slate-400">Score</span>
                            </div>
                            <div className="w-full bg-[#F1F4F9] rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-[#1E5BE0] h-full rounded-full transition-all duration-500"
                                style={{ width: `${stu.completionPercentage}%` }}
                              />
                            </div>
                          </div>
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
                          <button
                            type="button"
                            onClick={() => toggleStudentStatus(stu)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              stu.status === "Active"
                                ? "border border-rose-200 text-rose-600 hover:bg-rose-50"
                                : "bg-[#22B573] text-white hover:bg-emerald-600 shadow-xs"
                            }`}
                          >
                            {stu.status === "Active" ? "Suspend" : "Re-activate"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
