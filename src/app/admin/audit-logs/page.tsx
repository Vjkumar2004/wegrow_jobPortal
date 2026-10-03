import React from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { adminService } from "@/services/admin.service";
import AdminAuditClient from "./AdminAuditClient";

export const metadata = {
  title: "Audit Logs & Security Trail | WeGrow Admin",
  description: "Immutable security trail of administrative actions, verifications, and dispatches.",
};

export default async function AdminAuditLogsPage() {
  const logs = await adminService.getAuditLogs();

  return (
    <AdminLayout>
      <AdminAuditClient initialLogs={logs} />
    </AdminLayout>
  );
}
