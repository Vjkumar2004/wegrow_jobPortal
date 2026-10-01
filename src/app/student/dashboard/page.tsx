import React from "react";
import StudentDashboardClient from "./StudentDashboardClient";
import { studentService } from "@/services/student.service";

export const metadata = {
  title: "Student Dashboard | WeGrow Skill Campus",
  description: "Candidate dashboard for tracked applications, scheduled interviews, and recommended campus job matches.",
};

export default async function StudentDashboardPage() {
  // Fetch from backend API (via apiClient.get('/student/dashboard')) with seamless fallback
  const initialData = await studentService.getDashboardData();

  return <StudentDashboardClient initialData={initialData} />;
}
