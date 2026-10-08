import React from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import AdminDashboardClient from "./AdminDashboardClient";

export const metadata = {
  title: "Admin Control Center | WeGrow Skill Campus",
  description: "Enterprise command center for campus moderation, company approvals, audit logs, and analytics.",
};

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <AdminDashboardClient />
    </AdminLayout>
  );
}
