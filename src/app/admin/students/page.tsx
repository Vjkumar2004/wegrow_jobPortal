"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { MOCK_STUDENTS_ADMIN } from "@/constants/mockData";
import { StatusBadge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { GraduationCap, ShieldAlert, Check } from "lucide-react";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState(MOCK_STUDENTS_ADMIN);

  const toggleStudentStatus = (id: string) => {
    setStudents(
      students.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            status: s.status === "Active" ? "Suspended" : "Active"
          };
        }
        return s;
      })
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered students, profile completion scores, colleges, and moderation statuses.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Student Profile</th>
                  <th className="py-3.5 px-4">College</th>
                  <th className="py-3.5 px-4">Batch</th>
                  <th className="py-3.5 px-4">Profile Score</th>
                  <th className="py-3.5 px-4">Applications</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 text-sm">{stu.name}</p>
                      <p className="text-[11px] text-slate-400">{stu.email}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{stu.college}</td>
                    <td className="py-3.5 px-4 text-slate-500">{stu.gradYear}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{stu.completionPercentage}%</span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5">
                          <div
                            className="bg-[#0756A8] h-full rounded-full"
                            style={{ width: `${stu.completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#0756A8]">{stu.applicationsCount}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={stu.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant={stu.status === "Active" ? "outline" : "soft"}
                        size="sm"
                        onClick={() => toggleStudentStatus(stu.id)}
                      >
                        {stu.status === "Active" ? "Suspend" : "Activate"}
                      </Button>
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
