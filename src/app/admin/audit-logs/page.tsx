import React from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { adminService } from "@/services/admin.service";
import { FileSpreadsheet, ShieldCheck, Clock } from "lucide-react";

export const metadata = {
  title: "Audit Logs & Security Trail | WeGrow Admin",
};

export default async function AdminAuditLogsPage() {
  const logs = await adminService.getAuditLogs();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Security & Moderation Audit Logs</h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable system log trail of administrative interventions, company approvals, and account status modifications.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Log ID</th>
                  <th className="py-3.5 px-4">Action Executed</th>
                  <th className="py-3.5 px-4">Target Entity</th>
                  <th className="py-3.5 px-4">Actor</th>
                  <th className="py-3.5 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{log.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{log.action}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{log.target}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-blue-50 text-[#0756A8] px-2 py-0.5 rounded font-semibold text-[11px]">
                        {log.admin}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400">{log.timestamp}</td>
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
