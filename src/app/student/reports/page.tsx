import React from "react";
import { studentService } from "@/services/student.service";
import StudentReportsClient from "./StudentReportsClient";

export const metadata = {
  title: "Reports & Insights | WeGrow Student",
  description: "Performance metrics, application conversion velocity, and interview outcomes.",
};

export default async function StudentReportsPage() {
  const reportsData = await studentService.getReports();

  return <StudentReportsClient initialData={reportsData} />;
}
