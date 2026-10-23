import React from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { adminService } from "@/services/admin.service";
import AdminHRClient from "./AdminHRClient";

export const metadata = {
  title: "HR & Company Management | WeGrow Admin",
};

export default async function AdminHRManagementPage() {
  const initialData = await adminService.getCompanies({ page: 1, limit: 10 });

  return (
    <AdminLayout>
      <AdminHRClient initialData={initialData} />
    </AdminLayout>
  );
}
