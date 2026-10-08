import React from "react";
import StudentDashboardClient from "./StudentDashboardClient";

export const metadata = {
  title: "Student Dashboard | WeGrow Skill Campus",
  description: "Candidate dashboard for tracked applications, scheduled interviews, and recommended campus job matches.",
};

export default function StudentDashboardPage() {
  return <StudentDashboardClient />;
}
