import React from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { adminService } from "@/services/admin.service";
import AdminDashboardClient from "./AdminDashboardClient";

export const metadata = {
  title: "Admin Control Center | WeGrow Skill Campus",
  description: "Enterprise command center for campus moderation, company approvals, audit logs, and analytics.",
};

export default async function AdminDashboardPage() {
  const [reports, auditLogs, companies, students] = await Promise.all([
    adminService.getReports(),
    adminService.getAuditLogs(),
    adminService.getCompanies(),
    adminService.getStudents(),
  ]);

  return (
    <AdminLayout>
      <AdminDashboardClient
        reports={reports}
        auditLogs={auditLogs}
        companies={companies}
        students={students}
      />
    </AdminLayout>
  );
}
